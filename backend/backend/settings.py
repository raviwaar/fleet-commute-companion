import os
from pathlib import Path

from django import middleware

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "bhsbvslvbhjesvbsevbejhsv")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get("DJANGO_DEBUG", "True") == "True"

# If DEBUG is False, you MUST set ALLOWED_HOSTS
ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS", "127.0.0.1,localhost").split(",")

# Application definition
INSTALLED_APPS = [
    # Django default apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party packages
    'graphene_django',
    'corsheaders',

    # Our apps
    'apps.users.apps.UsersConfig',
    'apps.organisations.apps.OrganisationsConfig',
]

MIDDLEWARE = [
    # New: CORS Middleware MUST come first
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",

    'django.middleware.security.SecurityMiddleware',
    # Adding WhiteNoise for static files in production (optional but recommended)
    # 'whitenoise.middleware.WhiteNoiseMiddleware',

    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


ROOT_URLCONF = 'backend.urls'

# Templates configuration for admin and app templates
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

WSGI_APPLICATION = 'backend.wsgi.application'
ASGI_APPLICATION = 'backend.asgi.application'

# Database (Postgres example)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get("POSTGRES_DB", "fleet_mvp_db"),
        'USER': os.environ.get("POSTGRES_USER", "fleet_user"),
        'PASSWORD': os.environ.get("POSTGRES_PASSWORD", "fleet_password"),
        'HOST': os.environ.get("POSTGRES_HOST", "localhost"),
        'PORT': os.environ.get("POSTGRES_PORT", "5432"),
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Static files
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# GraphQL
GRAPHENE = {
    "SCHEMA": "backend.schema.schema",
    "MIDDLEWARE": [
        "graphql_jwt.middleware.JSONWebTokenMiddleware",
    ],
}

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# --- Custom User Model Configuration ---
AUTH_USER_MODEL = 'users.User'

# New: Authentication Backends (Best practice when customizing User Model)
# Ensures Django still uses the ModelBackend for login
AUTHENTICATION_BACKENDS = [
    "graphql_jwt.backends.JSONWebTokenBackend",
    "django.contrib.auth.backends.ModelBackend",
]

# --- CORS Headers Configuration (Crucial for API Development) ---
# Allows requests from the listed origins (e.g., your frontend running on localhost:3000)
# IMPORTANT: In production, NEVER use CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_ALL_ORIGINS = DEBUG  # Only allow all origins in DEBUG mode for development ease

if not DEBUG:
    # Example: If your frontend runs at https://myfrontend.com and http://localhost:3000
    CORS_ALLOWED_ORIGINS = [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:8000',
        # Add your production frontend URL here when deployed
        # 'https://your-frontend-domain.com',
    ]

# Allow sending cookies with requests
CORS_ALLOW_CREDENTIALS = True
SECRET_KEY='bdabcioq22332dnjwdw'