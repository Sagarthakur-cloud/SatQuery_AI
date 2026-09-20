from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import (
    SatelliteSceneViewSet,
    AnalysisRequestViewSet,
    AnalysisResultViewSet,
    ai_query,
    register,
    get_current_user,
    proxy_thumbnail,
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'satellite-scenes', SatelliteSceneViewSet)
router.register(r'analysis-requests', AnalysisRequestViewSet)
router.register(r'analysis-results', AnalysisResultViewSet)

urlpatterns = [
    # Auth
    path('auth/register/', register, name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', get_current_user, name='current_user'),

    # AI Query
    path('ai-query/', ai_query, name='ai-query'),

    # ViewSets
    path('', include(router.urls)),
    path('proxy-thumbnail/', proxy_thumbnail, name='proxy-thumbnail'),
]