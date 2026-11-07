# =========================================================
# accounts/views.py
# FULL MERGED + UPDATED
# MONGODB + JWT + OTP + PROFILE + SETTINGS
# =========================================================

import random

from datetime import datetime

from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import (
    IsAuthenticated,
    AllowAny
)
from rest_framework import status

from rest_framework_simplejwt.tokens import RefreshToken


# =========================================================
# MONGODB COLLECTIONS
# =========================================================

from database.mongo import (
    users_collection,
    analytics_collection,
    settings_collection
)


# =========================================================
# REGISTER VIEW
# =========================================================

class RegisterView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        username = request.data.get(
            "username"
        )

        email = request.data.get(
            "email"
        )

        password = request.data.get(
            "password"
        )

        # ======================================
        # VALIDATION
        # ======================================

        if not username or not email or not password:

            return Response({

                "success": False,

                "message":
                "All fields are required"

            }, status=400)

        # ======================================
        # USERNAME CHECK
        # ======================================

        if User.objects.filter(
            username=username
        ).exists():

            return Response({

                "success": False,

                "message":
                "Username already exists"

            }, status=400)

        # ======================================
        # EMAIL CHECK
        # ======================================

        if User.objects.filter(
            email=email
        ).exists():

            return Response({

                "success": False,

                "message":
                "Email already exists"

            }, status=400)

        # ======================================
        # CREATE DJANGO USER
        # ======================================

        user = User.objects.create_user(

            username=username,

            email=email,

            password=password
        )

        # ======================================
        # SAVE USER TO MONGODB
        # ======================================

        mongo_user = {

            "username":
            username,

            "email":
            email,

            "password":
            make_password(password),

            "phone":
            "",

            "avatar":
            "",

            "role":
            "user",

            "created_at":
            datetime.utcnow(),

            "last_login":
            datetime.utcnow()
        }

        mongo_result = users_collection.insert_one(
            mongo_user
        )

        mongo_user_id = str(
            mongo_result.inserted_id
        )

        # ======================================
        # CREATE DEFAULT SETTINGS
        # ======================================

        settings_collection.insert_one({

            "user_id":
            mongo_user_id,

            "username":
            username,

            "email":
            email,

            "notifications":
            True,

            "dark_mode":
            True,

            "two_factor":
            False,

            "updated_at":
            datetime.utcnow()
        })

        # ======================================
        # CREATE ANALYTICS ENTRY
        # ======================================

        analytics_collection.insert_one({

            "user_id":
            mongo_user_id,

            "username":
            username,

            "email":
            email,

            "total_interviews":
            0,

            "average_score":
            0,

            "best_score":
            0,

            "completed_interviews":
            0,

            "weak_topics":
            [],

            "strong_topics":
            [],

            "updated_at":
            datetime.utcnow()
        })

        # ======================================
        # RESPONSE
        # ======================================

        return Response({

            "success": True,

            "message":
            "User Registered Successfully",

            "user": {

                "name":
                user.username,

                "email":
                user.email
            }

        })


# =========================================================
# LOGIN VIEW
# =========================================================

class LoginView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        username = request.data.get(
            "username"
        )

        password = request.data.get(
            "password"
        )

        # ======================================
        # VALIDATION
        # ======================================

        if not username or not password:

            return Response({

                "success": False,

                "message":
                "Username and Password required"

            }, status=400)

        # ======================================
        # AUTHENTICATE USER
        # ======================================

        user = authenticate(

            username=username,

            password=password
        )

        # ======================================
        # INVALID USER
        # ======================================

        if user is None:

            return Response({

                "success": False,

                "message":
                "Invalid Credentials"

            }, status=400)

        # ======================================
        # UPDATE LAST LOGIN
        # ======================================

        users_collection.update_one(

            {
                "username":
                username
            },

            {
                "$set": {

                    "last_login":
                    datetime.utcnow()
                }
            }
        )

        # ======================================
        # GENERATE JWT TOKENS
        # ======================================

        refresh = RefreshToken.for_user(
            user
        )

        return Response({

            "success": True,

            "message":
            "Login Successful",

            "access":
            str(refresh.access_token),

            "refresh":
            str(refresh),

            "user": {

                "name":
                user.username,

                "email":
                user.email
            }

        })


# =========================================================
# SEND OTP VIEW
# =========================================================

class SendOTPView(APIView):

    authentication_classes = []

    permission_classes = []

    def post(self, request):

        email = request.data.get(
            "email"
        )

        if not email:

            return Response({

                "success": False,

                "message":
                "Email is required"

            }, status=400)

        # ======================================
        # EMAIL EXISTS CHECK
        # ======================================

        user = User.objects.filter(
            email=email
        ).first()

        if not user:

            return Response({

                "success": False,

                "message":
                "Email not registered"

            }, status=404)

        # ======================================
        # GENERATE OTP
        # ======================================

        otp = str(
            random.randint(
                100000,
                999999
            )
        )

        request.session["otp"] = otp

        request.session["email"] = email

        # ======================================
        # SEND EMAIL
        # ======================================

        try:

            send_mail(

                subject="AI Interview OTP",

                message=f"Your OTP is {otp}",

                from_email=
                settings.EMAIL_HOST_USER,

                recipient_list=[
                    email
                ],

                fail_silently=False
            )

            return Response({

                "success": True,

                "message":
                "OTP sent successfully"

            })

        except Exception as e:

            return Response({

                "success": False,

                "message":
                str(e)

            }, status=500)


# =========================================================
# VERIFY OTP VIEW
# =========================================================

class VerifyOTPView(APIView):

    authentication_classes = []

    permission_classes = []

    def post(self, request):

        entered_otp = request.data.get(
            "otp"
        )

        entered_email = request.data.get(
            "email"
        )

        saved_otp = request.session.get(
            "otp"
        )

        saved_email = request.session.get(
            "email"
        )

        # ======================================
        # VERIFY OTP
        # ======================================

        if (
            entered_otp == saved_otp
            and
            entered_email == saved_email
        ):

            return Response({

                "success": True,

                "message":
                "OTP Verified Successfully"

            })

        return Response({

            "success": False,

            "message":
            "Invalid OTP"

        }, status=400)


# =========================================================
# PROFILE VIEW
# =========================================================

class ProfileView(APIView):

    permission_classes = [IsAuthenticated]

    # =====================================================
    # GET PROFILE
    # =====================================================

    def get(self, request):

        try:

            # ------------------------------------------------
            # DJANGO AUTHENTICATED USER
            # ------------------------------------------------

            user = request.user

            print(
                "=============================================="
            )

            print(
                "PROFILE API CALLED"
            )

            print(
                "DJANGO USER =",
                user
            )

            print(
                "USERNAME =",
                user.username
            )

            print(
                "EMAIL =",
                user.email
            )

            print(
                "USER ID =",
                user.id
            )

            print(
                "=============================================="
            )

            # ------------------------------------------------
            # FIND USER IN MONGODB USING USERNAME
            # ------------------------------------------------

            mongo_user = users_collection.find_one({

                "username":
                user.username

            })

            # ------------------------------------------------
            # IF USERNAME NOT FOUND
            # TRY EMAIL
            # ------------------------------------------------

            if not mongo_user:

                print(
                    "MongoDB username match not found."
                )

                print(
                    "Trying email match..."
                )

                mongo_user = users_collection.find_one({

                    "email":
                    user.email

                })

            # ------------------------------------------------
            # USER STILL NOT FOUND
            #
            # IMPORTANT:
            # DO NOT RETURN 404
            #
            # DJANGO USER IS ALREADY AUTHENTICATED.
            # CREATE/SYNC MONGODB PROFILE.
            # ------------------------------------------------

            if not mongo_user:

                print(
                    "MongoDB USER NOT FOUND"
                )

                print(
                    "Creating MongoDB profile..."
                )

                mongo_user_data = {

                    "username":
                    user.username,

                    "email":
                    user.email,

                    "password":
                    "",

                    "phone":
                    "",

                    "avatar":
                    "",

                    "role":
                    "user",

                    "created_at":
                    datetime.utcnow(),

                    "last_login":
                    datetime.utcnow()
                }

                # ------------------------------------------------
                # INSERT MONGO PROFILE
                # ------------------------------------------------

                mongo_result = users_collection.insert_one(
                    mongo_user_data
                )

                # Keep inserted data in memory
                # without MongoDB ObjectId issue
                mongo_user = mongo_user_data

                print(
                    "MongoDB profile created successfully."
                )

                print(
                    "MongoDB ID =",
                    mongo_result.inserted_id
                )

            # ------------------------------------------------
            # GET PROFILE DATA
            # ------------------------------------------------

            name = mongo_user.get(

                "username",

                user.username

            )

            email = mongo_user.get(

                "email",

                user.email

            )

            avatar = mongo_user.get(

                "avatar",

                ""

            )

            role = mongo_user.get(

                "role",

                "user"

            )

            # ------------------------------------------------
            # SUCCESS RESPONSE
            # ------------------------------------------------

            response_data = {

                "success":
                True,

                "name":
                name,

                "email":
                email,

                "avatar":
                avatar,

                "role":
                role

            }

            print(
                "PROFILE SUCCESS:",
                response_data
            )

            print(
                "=============================================="
            )

            return Response(

                response_data,

                status=200

            )

        # ----------------------------------------------------
        # ERROR HANDLING
        # ----------------------------------------------------

        except Exception as e:

            print(
                "PROFILE API ERROR =",
                str(e)
            )

            return Response({

                "success":
                False,

                "message":
                "Failed to fetch user profile",

                "error":
                str(e)

            }, status=500)


    # =====================================================
    # UPDATE PROFILE
    # =====================================================

    def put(self, request):

        try:

            user = request.user

            # ------------------------------------------------
            # GET REQUEST DATA
            # ------------------------------------------------

            name = request.data.get(

                "name",

                user.username

            )

            email = request.data.get(

                "email",

                user.email

            )

            phone = request.data.get(

                "phone",

                ""

            )

            avatar = request.data.get(

                "avatar",

                ""

            )

            # ------------------------------------------------
            # STORE OLD USERNAME
            #
            # IMPORTANT:
            # MongoDB lookup should use old username
            # before changing Django username.
            # ------------------------------------------------

            old_username = user.username

            # ------------------------------------------------
            # UPDATE DJANGO USER
            # ------------------------------------------------

            user.username = name

            user.email = email

            user.save()

            # ------------------------------------------------
            # UPDATE MONGODB USER
            # ------------------------------------------------

            users_collection.update_one(

                {

                    "username":
                    old_username

                },

                {

                    "$set": {

                        "username":
                        name,

                        "email":
                        email,

                        "phone":
                        phone,

                        "avatar":
                        avatar

                    }

                }

            )

            # ------------------------------------------------
            # UPDATE SETTINGS
            # ------------------------------------------------

            settings_collection.update_one(

                {

                    "username":
                    old_username

                },

                {

                    "$set": {

                        "username":
                        name,

                        "email":
                        email

                    }

                },

                upsert=True

            )

            # ------------------------------------------------
            # UPDATE ANALYTICS
            # ------------------------------------------------

            analytics_collection.update_one(

                {

                    "username":
                    old_username

                },

                {

                    "$set": {

                        "username":
                        name,

                        "email":
                        email

                    }

                },

                upsert=True

            )

            # ------------------------------------------------
            # RESPONSE
            # ------------------------------------------------

            return Response({

                "success":
                True,

                "message":
                "Profile updated successfully",

                "name":
                name,

                "email":
                email,

                "phone":
                phone,

                "avatar":
                avatar

            }, status=200)

        except Exception as e:

            print(
                "PROFILE UPDATE ERROR =",
                str(e)
            )

            return Response({

                "success":
                False,

                "message":
                "Profile update failed",

                "error":
                str(e)

            }, status=500)


# =========================================================
# SETTINGS VIEW
# =========================================================

class SettingsView(APIView):

    permission_classes = [IsAuthenticated]

    # =====================================================
    # GET SETTINGS
    # =====================================================

    def get(self, request):

        user = request.user

        settings_data = settings_collection.find_one({

            "username":
            user.username

        })

        if not settings_data:

            return Response({

                "success":
                False,

                "message":
                "Settings not found"

            }, status=404)

        return Response({

            "success":
            True,

            "notifications":
            settings_data.get(
                "notifications",
                True
            ),

            "two_factor":
            settings_data.get(
                "two_factor",
                False
            ),

            "dark_mode":
            settings_data.get(
                "dark_mode",
                True
            )

        })


    # =====================================================
    # UPDATE SETTINGS
    # =====================================================

    def put(self, request):

        user = request.user

        notifications = request.data.get(
            "notifications"
        )

        two_factor = request.data.get(
            "two_factor"
        )

        dark_mode = request.data.get(
            "dark_mode"
        )

        settings_collection.update_one(

            {

                "username":
                user.username

            },

            {

                "$set": {

                    "notifications":
                    notifications,

                    "two_factor":
                    two_factor,

                    "dark_mode":
                    dark_mode,

                    "updated_at":
                    datetime.utcnow()

                }

            }

        )

        return Response({

            "success":
            True,

            "message":
            "Settings Updated Successfully",

            "notifications":
            notifications,

            "two_factor":
            two_factor,

            "dark_mode":
            dark_mode

        })


# =========================================================
# CHANGE PASSWORD VIEW
# =========================================================

class ChangePasswordView(APIView):

    permission_classes = [IsAuthenticated]

    def put(self, request):

        user = request.user

        current_password = request.data.get(
            "current_password"
        )

        new_password = request.data.get(
            "new_password"
        )

        # ======================================
        # VALIDATION
        # ======================================

        if (
            not current_password
            or
            not new_password
        ):

            return Response({

                "success":
                False,

                "message":
                "All fields are required"

            }, status=400)

        # ======================================
        # CHECK CURRENT PASSWORD
        # ======================================

        if not user.check_password(
            current_password
        ):

            return Response({

                "success":
                False,

                "message":
                "Current Password Incorrect"

            }, status=400)

        # ======================================
        # UPDATE DJANGO PASSWORD
        # ======================================

        user.set_password(
            new_password
        )

        user.save()

        # ======================================
        # UPDATE MONGODB PASSWORD
        # ======================================

        users_collection.update_one(

            {

                "email":
                user.email

            },

            {

                "$set": {

                    "password":
                    make_password(
                        new_password
                    )

                }

            }

        )

        # ======================================
        # RESPONSE
        # ======================================

        return Response({

            "success":
            True,

            "message":
            "Password Updated Successfully"

        })