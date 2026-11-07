from rest_framework.decorators import api_view
from rest_framework.response import Response

from utils.mongodb import db


@api_view(['GET'])
def analytics(request):

    data = {

        "average_score": 85,

        "strong_area": "React"
    }

    db.analytics.insert_one(data)

    return Response(data)