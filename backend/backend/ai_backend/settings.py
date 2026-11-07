# ==========================================
# settings.py
# ==========================================
from pathlib import Path
from datetime import timedelta
import os
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(os.path.join(BASE_DIR, ".env"))

# ==========================================
# SECURITY
# ==========================================

SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "dev-only-insecure-key-change-me")
DEBUG = True

ALLOWED_HOSTS = ["*"]

# ==========================================
# AI KEYS
# ==========================================

# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
# OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
# TWILIO_AUTH_TOKEN = os.getenv(
#     "TWILIO_AUTH_TOKEN"
# )

# TWILIO_PHONE_NUMBER = os.getenv(
#     "TWILIO_PHONE_NUMBER"
# )

# ==========================================
# INSTALLED APPS
# ==========================================

INSTALLED_APPS = [

    # Django Apps
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Third Party Apps
    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders",

    # Project Apps
    "accounts",
    "users",
    "resume",
    "interview",
    "analytics_app",
    "reports",
    "ai_engine",
    "dashboard",
]

# ==========================================
# MIDDLEWARE
# ==========================================

MIDDLEWARE = [

    "corsheaders.middleware.CorsMiddleware",

    "django.middleware.security.SecurityMiddleware",

    "django.contrib.sessions.middleware.SessionMiddleware",

    "django.middleware.common.CommonMiddleware",

    "django.middleware.csrf.CsrfViewMiddleware",

    "django.contrib.auth.middleware.AuthenticationMiddleware",

    "django.contrib.messages.middleware.MessageMiddleware",

    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# ==========================================
# ROOT URL CONFIG
# ==========================================

ROOT_URLCONF = "ai_backend.urls"

# ==========================================
# TEMPLATES
# ==========================================

TEMPLATES = [
    {
        "BACKEND":
        "django.template.backends.django.DjangoTemplates",

        "DIRS": [],

        "APP_DIRS": True,

        "OPTIONS": {

            "context_processors": [

                "django.template.context_processors.request",

                "django.contrib.auth.context_processors.auth",

                "django.contrib.messages.context_processors.messages",
            ]
        },
    }
]

# ==========================================
# WSGI
# ==========================================

WSGI_APPLICATION = "ai_backend.wsgi.application"

# ==========================================
# DATABASE
# ==========================================

DATABASES = {

    "default": {

        "ENGINE":
        "django.db.backends.sqlite3",

        "NAME":
        BASE_DIR / "db.sqlite3",
    }
}

# ==========================================
# PASSWORD VALIDATORS
# ==========================================

AUTH_PASSWORD_VALIDATORS = [

    {
        "NAME":
        "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },

    {
        "NAME":
        "django.contrib.auth.password_validation.MinimumLengthValidator",
    },

    {
        "NAME":
        "django.contrib.auth.password_validation.CommonPasswordValidator",
    },

    {
        "NAME":
        "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# ==========================================
# LANGUAGE
# ==========================================

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True

# ==========================================
# DJANGO REST FRAMEWORK
# ==========================================

REST_FRAMEWORK = {

    "DEFAULT_AUTHENTICATION_CLASSES":  (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),

    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),

    "DEFAULT_RENDERER_CLASSES": (
        "rest_framework.renderers.JSONRenderer",
    ),
}

# ==========================================
# JWT SETTINGS
# ==========================================

SIMPLE_JWT = {

    "ACCESS_TOKEN_LIFETIME":
    timedelta(days=1),

    "REFRESH_TOKEN_LIFETIME":
    timedelta(days=7),

    "AUTH_HEADER_TYPES":
    ("Bearer",),

    "ROTATE_REFRESH_TOKENS":
    False,

    "BLACKLIST_AFTER_ROTATION":
    False,

    "UPDATE_LAST_LOGIN":
    True,
}

# ==========================================
# CORS
# ==========================================

CORS_ALLOW_ALL_ORIGINS = True

CORS_ALLOW_CREDENTIALS = True

# ==========================================
# STATIC FILES
# ==========================================

STATIC_URL = "/static/"

STATIC_ROOT = BASE_DIR / "staticfiles"

STATICFILES_DIRS = []

# ==========================================
# MEDIA FILES
# ==========================================

MEDIA_URL = "/media/"

MEDIA_ROOT = BASE_DIR / "media"
# EMAIL CONFIG

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

EMAIL_HOST = 'smtp.gmail.com'

EMAIL_PORT = 587

EMAIL_USE_TLS = True

EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER", "")

EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD", "")
# ==========================================
# DEFAULT AUTO FIELD
# ==========================================

DEFAULT_AUTO_FIELD = (
    "django.db.models.BigAutoField"
)