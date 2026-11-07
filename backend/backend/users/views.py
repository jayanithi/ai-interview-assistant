from rest_framework.decorators import api_view
from rest_framework.response import Response
from utils.mongodb import db


# =========================
# REGISTER
# =========================
@api_view(['POST'])
def register(request):

    data = request.data

    user = {

        "name": data.get("name"),
        "email": data.get("email"),
        "password": data.get("password")
    }

    db.users.insert_one(user)

    return Response({
        "message": "User Registered Successfully"
    })


# =========================
# LOGIN
# =========================
@api_view(['POST'])
def login(request):

    email = request.data.get("email")
    password = request.data.get("password")

    user = db.users.find_one({

        "email": email,
        "password": password
    })

    if user:

        return Response({
            "message": "Login Successful"
        })

    return Response({
        "error": "Invalid Email or Password"
    })


# =========================
# PROFILE
# =========================
@api_view(['GET'])
def profile(request):

    users = list(db.users.find({}, {"_id": 0}))

    return Response({
        "users": users
    })


# =========================
# LOGOUT
# =========================
@api_view(['POST'])
def logout(request):

    return Response({
        "message": "Logout Successful"
    })