from datetime import datetime
import requests

from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from ai_engine.question_generator import generate_interview_questions
from ai_engine.answer_evaluator import evaluate_answer

from database.mongo import (
    interview_collection,
    feedback_collection
)

# ==========================================
# OLLAMA
# ==========================================

class OllamaGenerateView(APIView):

    permission_classes = []

    def post(self, request):

        try:

            prompt = request.data.get(
                "prompt"
            )

            url = (
                "http://localhost:11434"
                "/api/generate"
            )

            payload = {

                "model": "llama3",

                "prompt": prompt,

                "stream": False
            }

            res = requests.post(
    url,
    json=payload,
    timeout=300
)

            return Response(
                res.json()
            )

        except Exception as e:

            return Response({

                "success": False,

                "message": str(e)

            }, status=500)


# ==========================================
# START INTERVIEW
# ==========================================

class StartInterviewView(APIView):

    permission_classes = []

    def get(self, request):

        try:

            role = request.GET.get(
                "role",
                "fullstack"
            )

            role_lower = (
                role.lower()
            )

            if role_lower in [
                "frontend",
                "frontend developer"
            ]:

                skills = [

                    "HTML",
                    "CSS",
                    "JavaScript",
                    "React",
                    "Redux",
                    "Material UI"
                ]

            elif role_lower in [
                "backend",
                "backend developer"
            ]:

                skills = [

                    "Python",
                    "Django",
                    "REST API",
                    "MongoDB",
                    "MySQL",
                    "Authentication"
                ]

            elif role_lower in [
                "aiml",
                "ai ml engineer",
                "ai/ml engineer"
            ]:

                skills = [

                    "Python",
                    "Machine Learning",
                    "Deep Learning",
                    "TensorFlow",
                    "PyTorch",
                    "NLP",
                    "LLM"
                ]

            else:

                skills = [

                    "React",
                    "JavaScript",
                    "Python",
                    "Django",
                    "MongoDB",
                    "REST API"
                ]

            questions = generate_interview_questions(
    role,
    skills
)

            return Response({

                "success": True,

                "role": role,

                "skills": skills,

                "questions": questions,

                "question":
                questions[0]
                if questions
                else ""

            })

        except Exception as e:

            return Response({

                "success": False,

                "message": str(e)

            }, status=500)


# ==========================================
# INTERVIEW QUESTIONS
# ==========================================

class InterviewQuestionsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        questions = [

            "Tell me about yourself",

            "What are your strengths?",

            "Why should we hire you?",

            "Explain your final year project."
        ]

        return Response({

            "success": True,

            "questions": questions

        })


# ==========================================
# SUBMIT ANSWER
# ==========================================

# ==========================================
# SUBMIT ANSWER
# ==========================================
class SubmitAnswerView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        try:

            question = request.data.get("question")
            answer = request.data.get("answer")
            role = request.data.get("role", "General")

            if not question:
                return Response({
                    "success": False,
                    "message": "Question is required"
                }, status=400)

            if not answer:
                return Response({
                    "success": False,
                    "message": "Answer is required"
                }, status=400)

            result = evaluate_answer(
                question,
                answer,
                role
            )

            score = result.get("overall_score", 0)
            technical = result.get("technical_score", 0)
            communication = result.get("communication_score", 0)
            confidence = result.get("confidence_score", 0)
            feedback = result.get("feedback", "")

            # Save interview result
            interview_collection.insert_one({

                "user_id": str(request.user.id),

                "username": request.user.username,

                "email": request.user.email,

                "role": role,

                "question": question,

                "answer": answer,

                "score": score,

                "technical_score": technical,

                "communication_score": communication,

                "confidence_score": confidence,

                "feedback": feedback,

                "created_at": datetime.utcnow()

            })

            # Save feedback separately
            feedback_collection.insert_one({

                "user_id": str(request.user.id),

                "username": request.user.username,

                "feedback": feedback,

                "created_at": datetime.utcnow()

            })

            return Response({

                "success": True,

                "score": score,

                "technical_score": technical,

                "communication_score": communication,

                "confidence_score": confidence,

                "feedback": feedback

            })

        except Exception as e:

            return Response({

                "success": False,

                "message": str(e)

            }, status=500)
# ==========================================
# DASHBOARD
# ==========================================

class DashboardView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        try:

            interviews = list(

                interview_collection.find({

                    "user_id":
                    str(request.user.id)

                })

            )

            total = len(interviews)

            if total == 0:

                return Response({

                    "total_interviews": 0,

                    "average_score": 0,

                    "highest_score": 0,

                    "technical_score": 0,

                    "communication_score": 0,

                    "confidence_score": 0,

                    "recent_interviews": []

                })

            scores = [
                int(i.get("score", 0))
                for i in interviews
            ]

            technical_scores = [
                int(i.get(
                    "technical_score", 0
                ))
                for i in interviews
            ]

            communication_scores = [
                int(i.get(
                    "communication_score", 0
                ))
                for i in interviews
            ]

            confidence_scores = [
                int(i.get(
                    "confidence_score", 0
                ))
                for i in interviews
            ]

            recent_interviews = []

            for interview in interviews[-5:]:

                recent_interviews.append({

                    "role":
                    interview.get(
                        "role",
                        "AI Interview"
                    ),

                    "score":
                    interview.get(
                        "score",
                        0
                    )

                })

            return Response({

                "total_interviews":
                total,

                "average_score":
                round(
                    sum(scores) /
                    total,
                    2
                ),

                "highest_score":
                max(scores),

                "technical_score":
                round(
                    sum(technical_scores) /
                    total,
                    2
                ),

                "communication_score":
                round(
                    sum(
                        communication_scores
                    ) / total,
                    2
                ),

                "confidence_score":
                round(
                    sum(
                        confidence_scores
                    ) / total,
                    2
                ),

                "recent_interviews":
                recent_interviews

            })

        except Exception as e:

            return Response({

                "success": False,

                "message": str(e)

            }, status=500)