from django.urls import path

from .views import (
    HeroStatsView,
    DashboardStatsView,
    AnalyticsView,
    ProfileView,
    SettingsView
)

urlpatterns = [

    path("hero/", HeroStatsView.as_view()),

    path("dashboard-stats/", DashboardStatsView.as_view()),

    path("analytics/", AnalyticsView.as_view()),

    path("profile/", ProfileView.as_view()),

    path("settings/", SettingsView.as_view()),

]