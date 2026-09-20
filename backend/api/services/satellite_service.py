# backend/api/services/satellite_service.py

import os
import requests
from datetime import datetime, timedelta


# ============================================
# CDSE AUTHENTICATION
# ============================================

def get_cdse_token():
    """CDSE se access token fetch karein"""
    token_url = "https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token"
    
    client_id = os.environ.get("CDSE_CLIENT_ID")
    client_secret = os.environ.get("CDSE_CLIENT_SECRET")
    
    if not client_id or not client_secret:
        print("ERROR: CDSE credentials not found in .env")
        return None
    
    payload = {
        "grant_type": "client_credentials",
        "client_id": client_id,
        "client_secret": client_secret,
    }
    
    try:
        response = requests.post(token_url, data=payload, timeout=30)
        response.raise_for_status()
        token = response.json().get("access_token")
        print(f"✓ CDSE token fetched")
        return token
    except Exception as e:
        print(f"CDSE token error: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Response: {e.response.text[:500]}")
        return None


# ============================================
# STAC SEARCH
# ============================================

def search_sentinel2(lat, lng, days_back=60, max_cloud=30):
    """Sentinel-2 images search karein"""
    token = get_cdse_token()
    if not token:
        return None
    
    delta = 0.005
    bbox = [lng - delta, lat - delta, lng + delta, lat + delta]
    
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days_back)
    
    url = "https://stac.dataspace.copernicus.eu/v1/search"
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }
    
    payload = {
        "collections": ["sentinel-2-l2a"],
        "bbox": bbox,
        "datetime": f"{start_date.strftime('%Y-%m-%d')}T00:00:00Z/{end_date.strftime('%Y-%m-%d')}T23:59:59Z",
        "limit": 10,
        "query": {"eo:cloud_cover": {"lt": max_cloud}},
        "sortby": [{"field": "properties.datetime", "direction": "desc"}],
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        response.raise_for_status()
        data = response.json()
        print(f"✓ Found {len(data.get('features', []))} Sentinel-2 scenes")
        return data
    except Exception as e:
        print(f"STAC search error: {e}")
        return None


# ============================================
# THUMBNAIL EXTRACTION
# ============================================

def get_thumbnail_url(stac_response):
    """STAC response se best thumbnail URL extract karein (improved)"""
    if not stac_response or "features" not in stac_response:
        return None
    
    features = stac_response["features"]
    if not features:
        return None
    
    first_item = features[0]
    assets = first_item.get("assets", {})
    
    # Debug: saare asset names print karein
    print(f"Available assets: {list(assets.keys())}")
    
    # Priority order — zyada possible names
    for key in [
        "thumbnail",
        "quicklook",
        "visual",
        "rendered_preview",
        "preview",
        "overview",
        "B04",  # Fallback: Red band
        "B02",  # Fallback: Blue band
        "B03",  # Fallback: Green band
    ]:
        if key in assets:
            href = assets[key].get("href")
            if href:
                print(f"✓ Using asset: {key} → {href[:80]}")
                return href
    
    print("✗ No thumbnail asset found")
    return None


def get_image_metadata(stac_response):
    if not stac_response or "features" not in stac_response:
        return {}
    features = stac_response["features"]
    if not features:
        return {}
    
    first_item = features[0]
    props = first_item.get("properties", {})
    
    return {
        "scene_id": first_item.get("id"),
        "acquisition_date": props.get("datetime"),
        "cloud_cover": props.get("eo:cloud_cover"),
        "platform": props.get("platform"),
        "total_scenes": len(features),
    }

import numpy as np
import rasterio
from rasterio.io import MemoryFile
from io import BytesIO

# ============================================
# NDVI / NDWI CALCULATIONS
# ============================================

def download_band_asset(band_url, token):
    """
    Sentinel-2 ka ek band download karein aur numpy array return karein.
    """
    try:
        response = requests.get(
            band_url,
            headers={'Authorization': f'Bearer {token}'},
            timeout=60,
        )
        response.raise_for_status()
        
        # Rasterio se GeoTIFF read karein
        with MemoryFile(BytesIO(response.content)) as memfile:
            with memfile.open() as dataset:
                band_data = dataset.read(1).astype(np.float32)
                return band_data
    except Exception as e:
        print(f"Band download error: {e}")
        return None


def get_band_url(stac_item, band_name):
    """
    STAC item se specific band ka URL nikalein.
    Band names: 'B03' (Green), 'B04' (Red), 'B08' (NIR)
    """
    assets = stac_item.get('assets', {})
    
    # Try different possible keys (resolution variants)
    for key in [f'{band_name}_10m', f'{band_name}_20m', band_name]:
        if key in assets:
            return assets[key].get('href')
    
    return None


def calculate_ndvi_ndwi(lat, lng, days_back=90):
    """
    Selected location ke liye NDVI aur NDWI calculate karein.
    
    Returns:
        dict with ndvi_mean, ndwi_mean, vegetation_pct, water_pct, etc.
    """
    # Step 1: STAC search
    stac_response = search_sentinel2(lat, lng, days_back=days_back, max_cloud=30)
    if not stac_response or 'features' not in stac_response:
        return {'error': 'No satellite data available'}
    
    features = stac_response['features']
    if not features:
        return {'error': 'No scenes found'}
    
    # Step 2: Best scene select karein (lowest cloud cover)
    best_item = min(
        features,
        key=lambda x: x['properties'].get('eo:cloud_cover', 100)
    )
    
    print(f"Processing scene: {best_item.get('id')}")
    print(f"Cloud cover: {best_item['properties'].get('eo:cloud_cover')}%")
    
    # Step 3: Bands ke URLs nikalein
    green_url = get_band_url(best_item, 'B03')
    red_url = get_band_url(best_item, 'B04')
    nir_url = get_band_url(best_item, 'B08')
    
    if not all([green_url, red_url, nir_url]):
        return {
            'error': 'Required bands not found',
            'available_assets': list(best_item.get('assets', {}).keys()),
        }
    
    # Step 4: Token fetch karein
    token = get_cdse_token()
    if not token:
        return {'error': 'Authentication failed'}
    
    # Step 5: Bands download karein
    print("Downloading bands...")
    green = download_band_asset(green_url, token)
    red = download_band_asset(red_url, token)
    nir = download_band_asset(nir_url, token)
    
    if green is None or red is None or nir is None:
        return {'error': 'Failed to download bands'}
    
    print(f"Band shapes: Green={green.shape}, Red={red.shape}, NIR={nir.shape}")
    
    # Step 6: NDVI calculate karein
    # NDVI = (NIR - Red) / (NIR + Red)
    nir_red_sum = nir + red
    nir_red_sum[nir_red_sum == 0] = 0.0001  # Division by zero avoid
    ndvi = (nir - red) / nir_red_sum
    
    # Step 7: NDWI calculate karein
    # NDWI = (Green - NIR) / (Green + NIR)
    green_nir_sum = green + nir
    green_nir_sum[green_nir_sum == 0] = 0.0001
    ndwi = (green - nir) / green_nir_sum
    
    # Step 8: Statistics calculate karein
    # Vegetation: NDVI > 0.3
    vegetation_pixels = np.sum(ndvi > 0.3)
    # Water: NDWI > 0.3 (ya NDVI < 0)
    water_pixels = np.sum(ndwi > 0.3)
    # Total valid pixels
    total_pixels = ndvi.size
    
    vegetation_pct = (vegetation_pixels / total_pixels) * 100
    water_pct = (water_pixels / total_pixels) * 100
    
    # Urban / Bare soil: NDVI between 0 and 0.2
    urban_pixels = np.sum((ndvi >= 0) & (ndvi <= 0.2))
    urban_pct = (urban_pixels / total_pixels) * 100
    
    # Step 9: Results
    results = {
        'ndvi_mean': float(np.mean(ndvi)),
        'ndvi_min': float(np.min(ndvi)),
        'ndvi_max': float(np.max(ndvi)),
        'ndwi_mean': float(np.mean(ndwi)),
        'ndwi_min': float(np.min(ndwi)),
        'ndwi_max': float(np.max(ndwi)),
        'vegetation_pct': round(vegetation_pct, 2),
        'water_pct': round(water_pct, 2),
        'urban_pct': round(urban_pct, 2),
        'total_pixels': int(total_pixels),
        'scene_id': best_item.get('id'),
        'acquisition_date': best_item['properties'].get('datetime'),
        'cloud_cover': best_item['properties'].get('eo:cloud_cover'),
    }
    
    print(f"NDVI mean: {results['ndvi_mean']:.3f}")
    print(f"NDWI mean: {results['ndwi_mean']:.3f}")
    print(f"Vegetation: {vegetation_pct:.1f}%")
    print(f"Water: {water_pct:.1f}%")
    print(f"Urban: {urban_pct:.1f}%")
    
    return results

def calculate_ndvi_ndwi_via_process_api(lat, lng, days_back=90):
    """
    Sentinel Hub Process API use karke NDVI/NDWI calculate karein.
    Ye method direct statistics return karta hai — koi band download nahi.
    """
    token = get_cdse_token()
    if not token:
        return {'error': 'Authentication failed'}
    
    # ~1km bounding box
    delta = 0.005
    bbox = [lng - delta, lat - delta, lng + delta, lat + delta]
    
    # Date range
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days_back)
    
    url = "https://sh.dataspace.copernicus.eu/api/v1/statistics"
    
    # Evalscript — NDVI aur NDWI calculate karega
    evalscript = """
    //VERSION=3
    function setup() {
        return {
            input: ["B03", "B04", "B08", "dataMask"],
            output: [
                { id: "ndvi", bands: 1, sampleType: "FLOAT32" },
                { id: "ndwi", bands: 1, sampleType: "FLOAT32" },
                { id: "dataMask", bands: 1 }
            ]
        };
    }
    
    function evaluatePixel(samples) {
        let ndvi = (samples.B08 - samples.B04) / (samples.B08 + samples.B04 + 0.0001);
        let ndwi = (samples.B03 - samples.B08) / (samples.B03 + samples.B08 + 0.0001);
        return {
            ndvi: [ndvi],
            ndwi: [ndwi],
            dataMask: [samples.dataMask]
        };
    }
    """
    
    payload = {
        "input": {
            "bounds": {
                "bbox": bbox,
                "properties": {"crs": "http://www.opengis.net/def/crs/EPSG/0/4326"}
            },
            "data": [{
                "type": "sentinel-2-l2a",
                "dataFilter": {
                    "timeRange": {
                        "from": f"{start_date.strftime('%Y-%m-%d')}T00:00:00Z",
                        "to": f"{end_date.strftime('%Y-%m-%d')}T23:59:59Z"
                    },
                    "maxCloudCoverage": 30,
                    "mosaickingOrder": "leastCC"
                }
            }]
        },
        "aggregation": {
            "timeRange": {
                "from": f"{start_date.strftime('%Y-%m-%d')}T00:00:00Z",
                "to": f"{end_date.strftime('%Y-%m-%d')}T23:59:59Z"
            },
            "aggregationInterval": {"of": "P30D"},
            "evalscript": evalscript,
            "resx": 0.0001,
            "resy": 0.0001
        },
        "calculations": {
            "default": {}
        }
    }
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
    
    try:
        print("[NDVI/NDWI] Calling Sentinel Hub Process API...")
        response = requests.post(url, json=payload, headers=headers, timeout=120)
        response.raise_for_status()
        data = response.json()
        
        # Statistics extract karein
        results = parse_process_api_response(data)
        return results
        
    except Exception as e:
        print(f"[NDVI/NDWI] Process API error: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Response: {e.response.text[:500]}")
        return {'error': f'Process API failed: {str(e)}'}


def parse_process_api_response(data):
    """Sentinel Hub Process API response parse karein — simple version"""
    try:
        intervals = data.get('data', [])
        if not intervals:
            return {'error': 'No data intervals returned'}
        
        latest = intervals[-1]
        outputs = latest.get('outputs', {})
        
        ndvi_stats = outputs.get('ndvi', {}).get('bands', {}).get('B0', {}).get('stats', {})
        ndwi_stats = outputs.get('ndwi', {}).get('bands', {}).get('B0', {}).get('stats', {})
        
        ndvi_mean = ndvi_stats.get('mean', 0) or 0
        ndwi_mean = ndwi_stats.get('mean', 0) or 0
        
        print(f"[Parse] NDVI mean: {ndvi_mean}, NDWI mean: {ndwi_mean}")
        
        # Vegetation: NDVI ke basis par
        if ndvi_mean > 0.6:
            vegetation_pct = 80
        elif ndvi_mean > 0.4:
            vegetation_pct = 60
        elif ndvi_mean > 0.3:
            vegetation_pct = 45
        elif ndvi_mean > 0.2:
            vegetation_pct = 30
        elif ndvi_mean > 0.1:
            vegetation_pct = 15
        elif ndvi_mean > 0.05:
            vegetation_pct = 8
        else:
            vegetation_pct = 3
        
        # Water: NDWI ke basis par
        if ndwi_mean > 0.3:
            water_pct = 40
        elif ndwi_mean > 0.2:
            water_pct = 25
        elif ndwi_mean > 0.1:
            water_pct = 15
        elif ndwi_mean > 0.05:
            water_pct = 8
        elif ndwi_mean > 0:
            water_pct = 3
        else:
            water_pct = 0
        
        # Urban: baaki sab
        urban_pct = max(0, 100 - vegetation_pct - water_pct)
        
        return {
            'ndvi_mean': round(float(ndvi_mean), 4),
            'ndwi_mean': round(float(ndwi_mean), 4),
            'vegetation_pct': round(vegetation_pct, 2),
            'water_pct': round(water_pct, 2),
            'urban_pct': round(urban_pct, 2),
            'source': 'Sentinel Hub Process API (estimated)',
        }
    except Exception as e:
        print(f"Parse error: {e}")
        import traceback
        traceback.print_exc()
        return {'error': f'Parse failed: {str(e)}'}


def calculate_histogram_pct(histogram, threshold, above=True):
    """Histogram bins se percentage calculate karein"""
    if not histogram:
        return 0
    
    bins = histogram.get('bins', [])
    counts = histogram.get('counts', [])
    
    if not bins or not counts:
        return 0
    
    total = sum(counts)
    if total == 0:
        return 0
    
    matching = 0
    for i, bin_low in enumerate(bins):
        if above and bin_low >= threshold:
            matching += counts[i]
        elif not above and bin_low < threshold:
            matching += counts[i]
    
    return (matching / total) * 100


def calculate_histogram_pct_range(histogram, low, high):
    """Histogram bins se range percentage calculate karein"""
    if not histogram:
        return 0
    
    bins = histogram.get('bins', [])
    counts = histogram.get('counts', [])
    
    if not bins or not counts:
        return 0
    
    total = sum(counts)
    if total == 0:
        return 0
    
    matching = 0
    for i, bin_low in enumerate(bins):
        if low <= bin_low <= high:
            matching += counts[i]
    
    return (matching / total) * 100