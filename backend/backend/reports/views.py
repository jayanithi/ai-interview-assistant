from rest_framework.decorators import api_view
from rest_framework.response import Response

from utils.mongodb import db
from database.mongo import reports_collection

reports_collection.insert_one(report)

@api_view(['POST'])
def generate_report(request):

    report = {

        "report_name": "AI Interview Report",

        "score": 90
    }

    db.reports.insert_one(report)

    return Response({

        "message": "Report Generated",

        "report": report
    })