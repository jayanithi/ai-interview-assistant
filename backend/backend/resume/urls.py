from django.urls import path

from .views import (
    ResumeUploadView,
    ResumeAnalyticsView
)

urlpatterns = [

    path(
        "upload/",
        ResumeUploadView.as_view(),
        name="resume-upload"
    ),

    path(
        "analytics/",
        ResumeAnalyticsView.as_view(),
        name="resume-analytics"
    ),

]