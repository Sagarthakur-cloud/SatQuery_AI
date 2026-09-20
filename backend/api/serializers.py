from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    SatelliteScene,
    AnalysisRequest,
    AnalysisResult,
    UploadedImage,
)

from PIL import Image
import numpy as np


# ============================================
# COLOR-BASED IMAGE ANALYSIS
# ============================================
def analyze_image_colors(image_file):
    """RGB pixel analysis for land cover classification"""
    try:
        image_file.seek(0)
        img = Image.open(image_file).convert('RGB')
        img.thumbnail((500, 500))
        
        arr = np.array(img).astype(np.float32)
        R, G, B = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
        total = R.size
        
        # Vegetation: Green dominant
        vegetation_mask = (
            (G > R + 10) & 
            (G > B + 10) & 
            (G > 40) & 
            (G < 220)
        )
        
        # Water: Blue dominant
        water_mask = (
            (B > R + 15) & 
            (B > G + 10) & 
            (B > 60) & 
            (R < 130)
        )
        
        # Urban: Grey/brown
        brightness = (R + G + B) / 3
        max_channel = np.maximum(np.maximum(R, G), B)
        min_channel = np.minimum(np.minimum(R, G), B)
        saturation = (max_channel - min_channel) / (max_channel + 1)
        
        urban_mask = (
            (saturation < 0.2) &
            (brightness > 40) &
            (brightness < 220) &
            (~vegetation_mask) &
            (~water_mask)
        )
        
        veg_pct = (np.sum(vegetation_mask) / total) * 100
        water_pct = (np.sum(water_mask) / total) * 100
        urban_pct = (np.sum(urban_mask) / total) * 100
        
        # NDVI-like (greenness)
        greenness_index = (G - R - B) / (G + R + B + 1)
        ndvi_like = float(np.mean(greenness_index))
        
        # NDWI-like (blueness)
        blueness_index = (B - R - G) / (B + R + G + 1)
        ndwi_like = float(np.mean(blueness_index))
        
        return {
            'vegetation_pct': round(float(veg_pct), 2),
            'water_pct': round(float(water_pct), 2),
            'urban_pct': round(float(urban_pct), 2),
            'ndvi': round(ndvi_like, 4),
            'ndwi': round(ndwi_like, 4),
            'total_pixels': int(total),
            'source': 'RGB pixel analysis',
        }
    except Exception as e:
        print(f"[Image Analysis] Error: {e}")
        return {'error': str(e)}


# ============================================
# SERIALIZERS
# ============================================

class SatelliteSceneSerializer(serializers.ModelSerializer):
    class Meta:
        model = SatelliteScene
        fields = '__all__'


class AnalysisResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalysisResult
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match.")
        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError("Username already exists.")
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError("Email already registered.")
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
        return user


class UploadedImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedImage
        fields = ['id', 'image', 'uploaded_at']


class AnalysisRequestCreateSerializer(serializers.ModelSerializer):
    """Create analysis with automatic color-based analysis"""
    images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = AnalysisRequest
        fields = [
            'id', 'title', 'description', 'analysis_type',
            'query', 'start_date', 'end_date', 'status', 'images'
        ]
        read_only_fields = ['status']
    
    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['user'] = request.user
        
        if not validated_data.get('title'):
            query = validated_data.get('query', '')
            validated_data['title'] = query[:60] if query else 'New Analysis'
        
        # Auto-analysis on first image
        predictions = None
        if images_data:
            first_image = images_data[0]
            print(f"[Create] Analyzing {first_image.name}...")
            predictions = analyze_image_colors(first_image)
            
            if not predictions.get('error'):
                validated_data['status'] = 'completed'
                print(f"[Create] Analysis complete: {predictions}")
            else:
                validated_data['status'] = 'failed'
        else:
            validated_data['status'] = 'pending'
        
        analysis = AnalysisRequest.objects.create(**validated_data)
        
        for img in images_data:
            UploadedImage.objects.create(request=analysis, image=img)
        
        # Save AnalysisResult
        if predictions and not predictions.get('error'):
            AnalysisResult.objects.create(
                request=analysis,
                model_used='model_1',
                confidence=0.85,
                predictions=predictions,
            )
        
        return analysis


class AnalysisRequestSerializer(serializers.ModelSerializer):
    images = UploadedImageSerializer(many=True, read_only=True)
    predictions = serializers.SerializerMethodField()
    
    class Meta:
        model = AnalysisRequest
        fields = '__all__'
    
    def get_predictions(self, obj):
        try:
            result = obj.results.first()
            if result and result.predictions:
                return result.predictions
        except Exception as e:
            print(f"[Serializer] {e}")
        return None