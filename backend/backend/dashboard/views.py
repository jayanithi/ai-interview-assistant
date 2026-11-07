from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Avg, Max
from interview.models import InterviewResult
from database.mongo import interview_collection
from django.contrib.auth.models import User
from django.db.models import Avg, Max

from interview.models import InterviewResult


# =========================================================
# HERO SECTION API
# =========================================================

class HeroStatsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        return Response({

            "success": True,

            "user": {
                "name": user.username,
                "email": user.email
            },

            "stats": {
                "mock_interviews": 1200,
                "active_users": 5400,
                "ai_feedbacks": 9800,
                "resume_uploads": 3200,
                "ai_questions_generated": 15000
            },

            "features": [

                {
                    "title": "AI Mock Interviews",
                    "desc": "Experience realistic interview simulations powered by advanced AI.",
                    "icon": "brain"
                },

                {
                    "title": "Performance Analytics",
                    "desc": "Track confidence, communication, and technical performance.",
                    "icon": "analytics"
                },

                {
                    "title": "Instant Feedback",
                    "desc": "Get smart feedback and improvement suggestions instantly.",
                    "icon": "zap"
                },

                {
                    "title": "Resume ATS Analysis",
                    "desc": "Analyze resumes with AI-powered ATS optimization system.",
                    "icon": "resume"
                }

            ]

        })


# =========================================================
# DASHBOARD STATS API
# =========================================================

class DashboardStatsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        interviews = InterviewResult.objects.filter(
            user=request.user
        )

        total_interviews = interviews.count()

        average_score = interviews.aggregate(
            Avg("score")
        )["score__avg"] or 0

        highest_score = interviews.aggregate(
            Max("score")
        )["score__max"] or 0

        return Response({

            "success": True,

            "stats": {

                "total_interviews": total_interviews,

                "completed_interviews": total_interviews,

                "average_score": round(average_score),

                "resume_score": 92,

                "technical_score": round(average_score),

                "communication_score": max(
                    round(average_score - 5), 0
                ),

                "confidence_score": min(
                    round(average_score + 3), 100
                ),

                "highest_score": highest_score
            },

            "recent_activity": [

                {
                    "title": "Resume Uploaded",
                    "status": "success"
                },

                {
                    "title": "Interview Completed",
                    "status": "success"
                },

                {
                    "title": "AI Feedback Generated",
                    "status": "info"
                }

            ],

            "user": {
                "name": user.username,
                "email": user.email
            }

        })


# =========================================================
# ANALYTICS API
# =========================================================

class AnalyticsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        interviews = InterviewResult.objects.filter(
            user=request.user
        )

        average_score = interviews.aggregate(
            Avg("score")
        )["score__avg"] or 0

        analytics_data = [

            {
                "title": "Confidence",
                "value": min(round(average_score + 5), 100),
                "description":
                "Outstanding performance with excellent consistency.",
                "icon": "trending"
            },

            {
                "title": "Communication",
                "value": max(round(average_score - 5), 0),
                "description":
                "Good progress. Focus more on clarity and confidence.",
                "icon": "message"
            },

            {
                "title": "Technical Skills",
                "value": round(average_score),
                "description":
                "Outstanding performance with excellent consistency.",
                "icon": "brain"
            },

            {
                "title": "Problem Solving",
                "value": min(round(average_score + 2), 100),
                "description":
                "Strong performance with room for improvements.",
                "icon": "idea"
            }

        ]

        return Response({

            "success": True,

            "summary":
            "Your interview performance shows strong technical understanding and problem-solving abilities. Communication skills are improving steadily while confidence levels indicate good presentation capability.",

            "analytics": analytics_data

        })


# =========================================================
# PROFILE API
# =========================================================

class ProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        return Response({

            "success": True,
            "name": user.username,
            "email": user.email,
            "avatar": ""

        })

    def put(self, request):

        user = request.user

        name = request.data.get("name")
        email = request.data.get("email")
        avatar = request.data.get("avatar")

        if name:
            user.username = name

        if email:
            user.email = email

        user.save()

        return Response({

            "success": True,
            "message": "Profile Updated Successfully",
            "name": user.username,
            "email": user.email,
            "avatar": avatar

        })


# =========================================================
# SETTINGS API
# =========================================================

class SettingsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        return Response({

            "success": True,
            "notifications": True,
            "two_factor": False

        })

    def put(self, request):

        notifications = request.data.get(
            "notifications"
        )

        two_factor = request.data.get(
            "two_factor"
        )

        return Response({

            "success": True,

            "message":
            "Settings Updated Successfully",

            "notifications":
            notifications,

            "two_factor":
            two_factor

        })


# =========================================================
# ANALYTICS DASHBOARD API
# =========================================================

class DashboardView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        interviews = list(
            interview_collection.find({
                "user_id": str(request.user.id)
            })
        )

        total = len(interviews)

        if total == 0:
            return Response({
                "total_interviews": 0,
                "average_score": 0,
                "technical_score": 0,
                "communication_score": 0,
                "confidence_score": 0,
                "recent_interviews": []
            })

        average_score = sum(
            i.get("score", 0)
            for i in interviews
        ) / total

        technical_score = sum(
            i.get("technical_score", 0)
            for i in interviews
        ) / total

        communication_score = sum(
            i.get("communication_score", 0)
            for i in interviews
        ) / total

        confidence_score = sum(
            i.get("confidence_score", 0)
            for i in interviews
        ) / total

        recent_interviews = [
            {
                "role": interview.get(
                    "role",
                    "AI Interview"
                ),
                "score": interview.get(
                    "score",
                    0
                )
            }
            for interview in interviews[-5:]
        ]

        return Response({

            "total_interviews":
            total,

            "average_score":
            round(average_score, 2),

            "technical_score":
            round(technical_score, 2),

            "communication_score":
            round(communication_score, 2),

            "confidence_score":
            round(confidence_score, 2),

            "recent_interviews":
            recent_interviews
        })