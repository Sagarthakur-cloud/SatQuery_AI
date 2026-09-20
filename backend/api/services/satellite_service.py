# backend/api/services/satellite_service.py

import os
import requests
from datetime import datetime, timedelta
import numpy as np


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
    """STAC response se best thumbnail URL extract karein"""
    if not stac_response or "features" not in stac_response:
        return None
    
    features = stac_response["features"]
    if not features:
        return None
    
    first_item = features[0]
    assets = first_item.get("assets", {})
    
    print(f"Available assets: {list(assets.keys())}")
    
    for key in [
        "thumbnail",
        "quicklook",
        "visual",
        "rendered_preview",
        "preview",
        "overview",
    ]:
        if key in assets:
            href = assets[key].get("href")
            if href:
                print(f"✓ Using asset: {key}")
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


# ============================================
# NDVI / NDWI VIA SENTINEL HUB PROCESS API
# (Rasterio ki zaroorat NAHI — sirf requests + numpy)
# ============================================

def calculate_ndvi_ndwi_via_process_api(lat, lng, days_back=90):
    """
    Sentinel Hub Process API use karke NDVI/NDWI calculate karein.
    Direct statistics return karta hai — koi band download nahi.
    """
    token = get_cdse_token()
    if not token:
        return {'error': 'Authentication failed'}
    
    delta = 0.005
    bbox = [lng - delta, lat - delta, lng + delta, lat + delta]
    
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days_back)
    
    url = "https://sh.dataspace.copernicus.eu/api/v1/statistics"
    
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
        
        results = parse_process_api_response(data)
        return results
        
    except Exception as e:
        print(f"[NDVI/NDWI] Process API error: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Response: {e.response.text[:500]}")
        return {'error': f'Process API failed: {str(e)}'}


def parse_process_api_response(data):
    """Sentinel Hub Process API response parse karein"""
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
        
        # Vegetation estimate from NDVI
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
        
        # Water estimate from NDWI
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
        
        urban_pct = max(0, 100 - vegetation_pct - water_pct)
        
        return {
            'ndvi_mean': round(float(ndvi_mean), 4),
            'ndwi_mean': round(float(ndwi_mean), 4),
            'vegetation_pct': round(vegetation_pct, 2),
            'water_pct': round(water_pct, 2),
            'urban_pct': round(urban_pct, 2),
            'source': 'Sentinel Hub Process API',
        }
    except Exception as e:
        print(f"Parse error: {e}")
        import traceback
        traceback.print_exc()
        return {'error': f'Parse failed: {str(e)}'}


# ============================================
# FALLBACK: Rasterio-based (LOCAL ONLY — Render par NAHI chalega)
# ============================================

def calculate_ndvi_ndwi(lat, lng, days_back=90):
    """
    DEPRECATED — Render par kaam nahi karega (rasterio nahi hai).
    Sirf local development ke liye. Production mein Process API use karein.
    """
    return {'error': 'Rasterio-based NDVI not available on this deployment. Use Process API.'}