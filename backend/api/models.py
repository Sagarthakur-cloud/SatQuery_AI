from django.db import models
from django.contrib.gis.db import models as gis_models


class SatelliteScene(models.Model):
    """Store satellite imagery metadata"""
    SATELLITE_CHOICES = [
        ('SENTINEL-1', 'Sentinel-1 SAR'),
        ('SENTINEL-2', 'Sentinel-2 Optical'),
    ]
    
    satellite = models.CharField(max_length=20, choices=SATELLITE_CHOICES)
    scene_id = models.CharField(max_length=255, unique=True)
    acquisition_date = models.DateTimeField()
    cloud_cover = models.FloatField(null=True, blank=True)
    footprint = models.TextField(null=True, blank=True)
    raw_data = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-acquisition_date']
    
    def __str__(self):
        return f"{self.satellite} - {self.scene_id}"


class AnalysisRequest(models.Model):
    """Store user analysis requests"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    ANALYSIS_TYPES = [
        ('single', 'Single Image'),
        ('change', 'Change Detection'),
        ('sar', 'Optical + SAR'),
    ]
    
    user = models.ForeignKey(
        'auth.User',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='analysis_requests'
    )
    
    title = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    analysis_type = models.CharField(
        max_length=20,
        choices=ANALYSIS_TYPES,
        default='single'
    )
    query = models.TextField(blank=True)
    area_of_interest = models.TextField(null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title or f"Analysis #{self.id}"


class AnalysisResult(models.Model):
    """Store AI model predictions"""
    MODEL_CHOICES = [
        ('model_1', 'Model 1 - Classification'),
        ('model_2', 'Model 2 - Detection'),
        ('model_3', 'Model 3 - Segmentation'),
        ('model_4', 'Model 4 - Prediction'),
    ]
    
    request = models.ForeignKey(
        AnalysisRequest, 
        on_delete=models.CASCADE, 
        related_name='results'
    )
    model_used = models.CharField(max_length=20, choices=MODEL_CHOICES)
    confidence = models.FloatField()
    predictions = models.JSONField(default=dict)
    result_geometry = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.request.title} - {self.model_used}"


class UploadedImage(models.Model):
    """Store uploaded satellite images"""
    request = models.ForeignKey(
        AnalysisRequest,
        on_delete=models.CASCADE,
        related_name='images'
    )
    image = models.ImageField(upload_to='analysis_images/%Y/%m/%d/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Image for {self.request}"