# ==========================================
# ai_backend/urls.py
# ==========================================
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

from django.conf import settings
from django.conf.urls.static import static


# ==========================================
# HOME API
# ==========================================

def home(request):

    return JsonResponse({

        "success": True,

        "message":
        "AI Interview Assistant Backend Running Successfully"

    })


# ==========================================
# API HOME
# ==========================================

def api_home(request):

    return JsonResponse({

        "success": True,

        "message":
        "AI Interview Assistant API Running",

        "apis": {

            "accounts":
            "/api/accounts/",

            "interview":
            "/api/interview/",

            "resume":
            "/api/resume/",

            "dashboard":
            "/api/dashboard/"

        }

    })


# ==========================================
# URL PATTERNS
# ==========================================

urlpatterns = [

    # HOME
    path(
        '',
        home
    ),

    # API HOME
    path(
        'api/',
        api_home
    ),

    # ADMIN
    path(
        'admin/',
        admin.site.urls
    ),

    # ACCOUNTS API
    path(
        'api/accounts/',
        include('accounts.urls')
    ),

    # INTERVIEW API
    path(
        'api/interview/',
        include('interview.urls')
    ),

    # RESUME API
    path(
        'api/resume/',
        include('resume.urls')
    ),

    # DASHBOARD API
    path(
        'api/dashboard/',
        include('dashboard.urls')
    ),

]

# ==========================================
# MEDIA FILES
# ==========================================

if settings.DEBUG:

    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )