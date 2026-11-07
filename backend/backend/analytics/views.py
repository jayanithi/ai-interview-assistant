from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def analytics_dashboard(request):

    data = {
        "total_interviews": 12,
        "average_score": 84,
        "strong_area": "React",
        "weak_area": "DSA",
        "recent_scores": [80, 85, 90, 88]
    }

    return Response(data)