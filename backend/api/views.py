from rest_framework import viewsets
from django.contrib.auth.models import User
from rest_framework import status
from .models import SatelliteScene, AnalysisRequest, AnalysisResult
from .serializers import (
    SatelliteSceneSerializer,
    AnalysisRequestSerializer,
    AnalysisResultSerializer,
    AnalysisRequestCreateSerializer,
    UploadedImageSerializer,
    UserSerializer,
    RegisterSerializer,
)
from .services.satellite_service import (
    search_sentinel2,
    get_thumbnail_url,
    get_image_metadata,
    calculate_ndvi_ndwi,
    calculate_ndvi_ndwi_via_process_api,
    get_cdse_token,
)
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import HttpResponse
import requests as http_requests
import json


# ============================================
# AUTH VIEWS
# ============================================

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """User registration"""
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    """Get logged-in user info"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


# ============================================
# AI QUERY VIEW (Map Explorer)
# ============================================

@api_view(['POST'])
@permission_classes([AllowAny])
def ai_query(request):
    lat = request.data.get('lat')
    lng = request.data.get('lng')
    query = request.data.get('query', '')
    location_name = request.data.get('location_name', 'Selected Location')

    if not all([lat, lng, query]):
        return Response({'error': 'lat, lng, and query are required'}, status=400)

    try:
        lat_float = float(lat)
        lng_float = float(lng)
    except (ValueError, TypeError):
        return Response({'error': 'Invalid coordinates'}, status=400)

    print(f"\n[AI Query] Location: {lat_float}, {lng_float}")
    print(f"[AI Query] Query: {query}")

    # Step 1: Thumbnail + metadata
    stac_response = search_sentinel2(lat_float, lng_float, days_back=90, max_cloud=40)
    thumbnail_url = get_thumbnail_url(stac_response)
    metadata = get_image_metadata(stac_response)

    # Step 2: NDVI/NDWI via Process API
    print("[AI Query] Running NDVI/NDWI analysis...")
    analysis_results = calculate_ndvi_ndwi_via_process_api(
        lat_float, lng_float, days_back=90
    )
    print(f"[AI Query] Analysis results: {analysis_results}")

    # Merge metadata
    if metadata and not analysis_results.get('error'):
        if not analysis_results.get('scene_id'):
            analysis_results['scene_id'] = metadata.get('scene_id', 'Sentinel-2 L2A')
        if not analysis_results.get('acquisition_date'):
            analysis_results['acquisition_date'] = metadata.get('acquisition_date')
        if not analysis_results.get('cloud_cover'):
            analysis_results['cloud_cover'] = metadata.get('cloud_cover')

    # Step 3: Build answer
    if analysis_results.get('error'):
        answer = f"Found satellite image but analysis failed: {analysis_results['error']}"
    else:
        veg = analysis_results.get('vegetation_pct', 0)
        water = analysis_results.get('water_pct', 0)
        urban = analysis_results.get('urban_pct', 0)
        ndvi = analysis_results.get('ndvi_mean', 0)
        ndwi = analysis_results.get('ndwi_mean', 0)
        date = (analysis_results.get('acquisition_date') or '')[:10]

        query_lower = query.lower()

        if 'water' in query_lower:
            answer = (
                f"🌊 Water Analysis for this region:\n"
                f"• Water bodies cover approximately {water}% of the area\n"
                f"• Average NDWI: {ndwi:.3f} (positive = water present)\n"
                f"• Vegetation: {veg}% | Urban: {urban}%\n"
                f"• Analyzed from Sentinel-2 image dated {date}\n\n"
                f"Note: Values calculated using NDWI index from real satellite bands."
            )
        elif 'vegetation' in query_lower or 'forest' in query_lower:
            answer = (
                f"🌿 Vegetation Analysis:\n"
                f"• Vegetation covers approximately {veg}% of the area\n"
                f"• Average NDVI: {ndvi:.3f} (>0.3 indicates healthy vegetation)\n"
                f"• Water: {water}% | Urban: {urban}%\n"
                f"• Analyzed from Sentinel-2 image dated {date}\n\n"
                f"Note: Values calculated using NDVI index from real satellite bands."
            )
        elif 'urban' in query_lower or 'built' in query_lower:
            answer = (
                f"🏙️ Urban/Built-up Analysis:\n"
                f"• Built-up area: approximately {urban}% of the region\n"
                f"• Vegetation: {veg}% | Water: {water}%\n"
                f"• Average NDVI: {ndvi:.3f}\n"
                f"• Analyzed from Sentinel-2 image dated {date}"
            )
        elif 'agriculture' in query_lower or 'farm' in query_lower:
            answer = (
                f"🌾 Agricultural Analysis:\n"
                f"• Vegetation/Agriculture: approximately {veg}% of the area\n"
                f"• Average NDVI: {ndvi:.3f}\n"
                f"• Water bodies: {water}% | Urban: {urban}%\n"
                f"• Analyzed from Sentinel-2 image dated {date}"
            )
        else:
            answer = (
                f"📊 Land Cover Analysis:\n"
                f"• Vegetation: {veg}%\n"
                f"• Water Bodies: {water}%\n"
                f"• Urban/Bare Soil: {urban}%\n"
                f"• Average NDVI: {ndvi:.3f}\n"
                f"• Average NDWI: {ndwi:.3f}\n"
                f"• Analyzed from Sentinel-2 image dated {date}"
            )

    # Step 4: Create AnalysisRequest (SQLite-compatible — GeoJSON as Text)
    delta = 0.005
    polygon_geojson = json.dumps({
        "type": "Polygon",
        "coordinates": [[
            [lng_float - delta, lat_float - delta],
            [lng_float + delta, lat_float - delta],
            [lng_float + delta, lat_float + delta],
            [lng_float - delta, lat_float + delta],
            [lng_float - delta, lat_float - delta],
        ]]
    })

    analysis_request = None
    if request.user.is_authenticated:
        analysis_request = AnalysisRequest.objects.create(
            user=request.user,
            title=query[:60] or f"Map query at {lat_float:.4f}, {lng_float:.4f}",
            description=f"Location: {location_name}",
            analysis_type='single',
            query=query,
            area_of_interest=polygon_geojson,
            status='completed' if not analysis_results.get('error') else 'failed',
        )

        if not analysis_results.get('error'):
            AnalysisResult.objects.create(
                request=analysis_request,
                model_used='model_1',
                confidence=0.85,
                predictions={
                    'ndvi': analysis_results.get('ndvi_mean'),
                    'ndwi': analysis_results.get('ndwi_mean'),
                    'vegetation_pct': analysis_results.get('vegetation_pct'),
                    'water_pct': analysis_results.get('water_pct'),
                    'urban_pct': analysis_results.get('urban_pct'),
                    'scene_id': analysis_results.get('scene_id'),
                    'acquisition_date': analysis_results.get('acquisition_date'),
                },
            )

    return Response({
        'answer': answer,
        'location': {'lat': lat_float, 'lng': lng_float, 'name': location_name},
        'query': query,
        'status': 'success',
        'analysis_id': analysis_request.id if analysis_request else None,
        'satellite_data': {
            'thumbnail_url': thumbnail_url,
            'metadata': metadata,
            'has_image': thumbnail_url is not None,
        },
        'analysis_results': analysis_results,
        'models_used': ['NDVI', 'NDWI'],
    })


# ============================================
# PROXY THUMBNAIL
# ============================================

@api_view(['GET'])
@permission_classes([AllowAny])
def proxy_thumbnail(request):
    """CDSE thumbnail proxy"""
    thumbnail_url = request.query_params.get('url')

    if not thumbnail_url:
        return Response({'error': 'url parameter required'}, status=400)

    token = get_cdse_token()
    if not token:
        return Response({'error': 'CDSE authentication failed'}, status=401)

    try:
        response = http_requests.get(
            thumbnail_url,
            headers={'Authorization': f'Bearer {token}'},
            timeout=30,
        )
        response.raise_for_status()
        content_type = response.headers.get('Content-Type', 'image/jpeg')
        return HttpResponse(response.content, content_type=content_type)
    except Exception as e:
        print(f"Proxy thumbnail error: {e}")
        return Response(
            {'error': f'Failed to fetch thumbnail: {str(e)}'},
            status=500
        )


# ============================================
# VIEWSETS
# ============================================

class SatelliteSceneViewSet(viewsets.ModelViewSet):
    queryset = SatelliteScene.objects.all()
    serializer_class = SatelliteSceneSerializer


class AnalysisRequestViewSet(viewsets.ModelViewSet):
    queryset = AnalysisRequest.objects.all()

    def get_serializer_class(self):
        if self.action == 'create':
            return AnalysisRequestCreateSerializer
        return AnalysisRequestSerializer

    def perform_create(self, serializer):
        serializer.save()


class AnalysisResultViewSet(viewsets.ModelViewSet):
    queryset = AnalysisResult.objects.all()
    serializer_class = AnalysisResultSerializer