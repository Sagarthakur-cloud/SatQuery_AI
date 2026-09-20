from django.contrib import admin
from django.contrib.gis.admin import GISModelAdmin
from .models import SatelliteScene, AnalysisRequest, AnalysisResult


@admin.register(SatelliteScene)
class SatelliteSceneAdmin(GISModelAdmin):
    list_display = ('satellite', 'scene_id', 'acquisition_date', 'cloud_cover')
    list_filter = ('satellite',)
    search_fields = ('scene_id',)


@admin.register(AnalysisRequest)
class AnalysisRequestAdmin(GISModelAdmin):
    list_display = ('title', 'status', 'start_date', 'end_date', 'created_at')
    list_filter = ('status',)
    search_fields = ('title',)


@admin.register(AnalysisResult)
class AnalysisResultAdmin(GISModelAdmin):
    list_display = ('request', 'model_used', 'confidence', 'created_at')
    list_filter = ('model_used',)