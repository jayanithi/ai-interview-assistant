from django.urls import path

from .views import (

    # AUTH
    RegisterView,
    LoginView,

    # OTP
    SendOTPView,
    VerifyOTPView,

    # PROFILE
    ProfileView,

    # SETTINGS
    SettingsView,

    # PASSWORD
    ChangePasswordView,
)

urlpatterns = [

    # =========================================
    # AUTH APIs
    # =========================================

    path(
        "register/",
        RegisterView.as_view(),
        name="register"
    ),

    path(
        "login/",
        LoginView.as_view(),
        name="login"
    ),

    # =========================================
    # OTP APIs
    # =========================================

    path(
        "send-otp/",
        SendOTPView.as_view(),
        name="send-otp"
    ),

    path(
        "verify-otp/",
        VerifyOTPView.as_view(),
        name="verify-otp"
    ),

    # =========================================
    # PROFILE API
    # =========================================

    path(
        "profile/",
        ProfileView.as_view(),
        name="profile"
    ),

    # =========================================
    # SETTINGS API
    # =========================================

    path(
        "settings/",
        SettingsView.as_view(),
        name="settings"
    ),

    # =========================================
    # CHANGE PASSWORD API
    # =========================================

    path(
        "change-password/",
        ChangePasswordView.as_view(),
        name="change-password"
    ),

]