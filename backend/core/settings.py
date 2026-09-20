import os
import dj_database_url
from pathlib import Path
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# ============================================
# SECURITY
# ============================================
SECRET_KEY = os.environ.get(
    'SECRET_KEY',
    'django-insecure-s+aqlstz($bdm$a+5qe0iq0ff515-+=x3qznw$n%^6ctmp6q7_'
)
DEBUG = os.environ.get('DEBUG', 'False') == 'True'

ALLOWED_HOSTS = ['*']


# ============================================
# APPLICATION DEFINITION
# ============================================
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'api',
    'corsheaders',
    'rest_framework_simplejwt',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'


# ============================================
# DATABASE CONFIGURATION
# ============================================
DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get(
            'DATABASE_URL',
            f'sqlite:///{BASE_DIR / "db.sqlite3"}'
        ),
        conn_max_age=600,
        conn_health_checks=True,
    )
}


# ============================================
# PASSWORD VALIDATION
# ============================================
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]


# ============================================
# INTERNATIONALIZATION
# ============================================
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


# ============================================
# STATIC & MEDIA FILES
# ============================================
STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Media files — production mein Render URL use karein
if DEBUG:
    MEDIA_URL = '/media/'
else:
    RENDER_EXTERNAL_HOSTNAME = os.environ.get(
        'RENDER_EXTERNAL_HOSTNAME',
        'satquery-backend-dh6h.onrender.com'
    )
    MEDIA_URL = f'https://{RENDER_EXTERNAL_HOSTNAME}/media/'

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# ============================================
# GDAL / GEOS — sirf Windows local ke liye
# ============================================
if os.name == 'nt':
    GDAL_PATH = os.path.join(BASE_DIR, 'venv', 'Lib', 'site-packages', 'osgeo', 'gdal.dll')
    GEOS_PATH = os.path.join(BASE_DIR, 'venv', 'Lib', 'site-packages', 'osgeo', 'geos_c.dll')
    
    if os.path.exists(GDAL_PATH):
        GDAL_LIBRARY_PATH = GDAL_PATH
    if os.path.exists(GEOS_PATH):
        GEOS_LIBRARY_PATH = GEOS_PATH
    
    osgeo_path = os.path.join(BASE_DIR, 'venv', 'Lib', 'site-packages', 'osgeo')
    if os.path.exists(osgeo_path):
        os.environ['PATH'] = osgeo_path + os.pathsep + os.environ.get('PATH', '')


# ============================================
# CORS SETTINGS
# ============================================
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = [
    'https://*.vercel.app',
    'https://*.ngrok-free.app',
    'https://*.onrender.com',
    'http://localhost:5173',
]


# ============================================
# JWT SETTINGS
# ============================================
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=2),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
}