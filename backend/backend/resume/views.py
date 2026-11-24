
# =========================================================
# resume/views.py
# =========================================================

import os
import threading
from datetime import datetime

import fitz
from django.conf import settings
from django.core.files.storage import FileSystemStorage

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from pymongo import MongoClient

from resume.ai_resume_analyzer import analyze_resume


# =========================================================
# MONGODB
# =========================================================

client = MongoClient(
    "mongodb://localhost:27017/",
    serverSelectionTimeoutMS=5000
)

db = client["interview_ai"]
resume_collection = db["resumes"]


# =========================================================
# BACKGROUND AI ANALYSIS
# =========================================================

def run_background_analysis(resume_id, resume_text):

    try:
        print("RESUME AI: Analysis started")

        ai_result = analyze_resume(resume_text)

        if ai_result and str(ai_result).strip():

            status = "completed"

        else:

            status = "fallback"
            ai_result = "AI analysis could not generate a response."

        # FIX: resume_collection (not resumes_collection)
        result = resume_collection.update_one(
            {"_id": resume_id},
            {
                "$set": {
                    "ai_analysis": str(ai_result),
                    "ai_status": status,
                    "ai_completed_at": datetime.utcnow()
                }
            }
        )

        print("RESUME AI STATUS:", status)
        print("MONGO MATCHED:", result.matched_count)
        print("MONGO MODIFIED:", result.modified_count)

    except Exception as e:

        print("RESUME AI ERROR:", str(e))

        resume_collection.update_one(
            {"_id": resume_id},
            {
                "$set": {
                    "ai_status": "failed",
                    "ai_analysis": "Analysis failed: " + str(e)
                }
            }
        )


# =========================================================
# RESUME UPLOAD
# =========================================================

class ResumeUploadView(APIView):

    permission_classes = [IsAuthenticated]

    parser_classes = (
        MultiPartParser,
        FormParser
    )

    def post(self, request):

        try:

            uploaded_file = request.FILES.get("file")

            if not uploaded_file:
                return Response({
                    "success": False,
                    "message": "No File Uploaded"
                }, status=400)

            if not uploaded_file.name.lower().endswith(".pdf"):
                return Response({
                    "success": False,
                    "message": "Only PDF files allowed"
                }, status=400)

            # =================================================
            # SAVE FILE
            # =================================================

            resume_dir = os.path.join(
                settings.MEDIA_ROOT,
                "resumes"
            )

            os.makedirs(resume_dir, exist_ok=True)

            media_url = settings.MEDIA_URL or "/media/"

            if not media_url.endswith("/"):
                media_url += "/"

            fs = FileSystemStorage(
                location=resume_dir,
                base_url=f"{media_url}resumes/"
            )

            filename = fs.save(
                uploaded_file.name,
                uploaded_file
            )

            file_path = fs.path(filename)

            file_url = request.build_absolute_uri(
                fs.url(filename)
            )

            # =================================================
            # EXTRACT PDF TEXT
            # =================================================

            with fitz.open(file_path) as pdf:

                resume_text = "".join(
                    page.get_text() for page in pdf
                ).strip()

            if not resume_text:

                return Response({
                    "success": False,
                    "message": (
                        "No readable text found in this PDF. "
                        "Please upload a text-based PDF resume."
                    )
                }, status=400)

            # =================================================
            # SKILLS
            # =================================================

            skill_keywords = [
                "Python",
                "Java",
                "JavaScript",
                "React",
                "Node.js",
                "Django",
                "Flask",
                "FastAPI",
                "MongoDB",
                "MySQL",
                "PostgreSQL",
                "Redis",
                "Firebase",
                "Docker",
                "Kubernetes",
                "AWS",
                "Git",
                "REST API",
                "TensorFlow",
                "PyTorch",
                "Pandas",
                "NumPy",
                "Machine Learning",
                "Artificial Intelligence",
                "HTML",
                "CSS",
                "C++"
            ]

            resume_text_lower = resume_text.lower()

            extracted_skills = list(dict.fromkeys(
                skill for skill in skill_keywords
                if skill.lower() in resume_text_lower
            ))

            # =================================================
            # EXPERIENCE
            # =================================================

            experience_keywords = [
                "Intern",
                "Internship",
                "Developer",
                "Software Engineer",
                "Engineer",
                "Project",
                "Experience",
                "Worked",
                "Company",
                "Freelancer"
            ]

            extracted_experience = list(dict.fromkeys(
                item for item in experience_keywords
                if item.lower() in resume_text_lower
            ))

            # =================================================
            # EDUCATION
            # =================================================

            education_keywords = [
                "B.E",
                "B.Tech",
                "M.E",
                "M.Tech",
                "Bachelor",
                "Master",
                "Engineering",
                "Computer Science",
                "University",
                "College",
                "CGPA"
            ]

            extracted_education = list(dict.fromkeys(
                item for item in education_keywords
                if item.lower() in resume_text_lower
            ))

            # =================================================
            # REQUIRED SKILLS
            # =================================================

            required_skills = [
                "Python",
                "React",
                "MongoDB",
                "Django",
                "Docker",
                "AWS",
                "Git",
                "REST API",
                "Node.js"
            ]

            detected_skills_lower = {
                skill.lower() for skill in extracted_skills
            }

            missing_skills = [
                skill for skill in required_skills
                if skill.lower() not in detected_skills_lower
            ]

            # =================================================
            # ATS SCORE
            # =================================================

            ats_score = 0

            ats_score += min(len(extracted_skills) * 4, 40)
            ats_score += min(len(extracted_experience) * 5, 30)
            ats_score += min(len(extracted_education) * 3, 15)

            if len(resume_text) > 1000:
                ats_score += 15

            ats_score = min(ats_score, 100)

            # =================================================
            # SAVE INITIAL RESUME DATA
            # =================================================

            user_id = str(request.user.id)

            resume_document = {

                "user_id": user_id,

                "resume_name": filename,
                "resume_url": file_url,
                "resume_text": resume_text,

                "skills": extracted_skills,
                "experience": extracted_experience,
                "education": extracted_education,

                "missing_skills": missing_skills,

                "ats_score": ats_score,

                "ai_analysis": "",
                "ai_status": "processing",

                "uploaded_at": datetime.utcnow()
            }

            insert_result = resume_collection.insert_one(
                resume_document
            )

            print("RESUME INSERTED:", insert_result.inserted_id)

            # =================================================
            # START AI ANALYSIS IN BACKGROUND
            # =================================================

            analysis_thread = threading.Thread(
                target=run_background_analysis,
                args=(
                    insert_result.inserted_id,
                    resume_text
                ),
                daemon=True
            )

            analysis_thread.start()

            # =================================================
            # RESPONSE
            # =================================================

            return Response({

                "success": True,

                "message": "Resume Uploaded Successfully",

                "resume_id": str(insert_result.inserted_id),

                "resume_name": filename,
                "resume_url": file_url,
                "resume_text": resume_text,

                "skills": extracted_skills,
                "experience": extracted_experience,
                "education": extracted_education,

                "missing_skills": missing_skills,

                "ats_score": ats_score,

                "ai_analysis": "",
                "ai_status": "processing"

            }, status=200)

        except Exception as error:

            print("RESUME UPLOAD ERROR:", error)

            return Response({
                "success": False,
                "message": str(error)
            }, status=500)


# =========================================================
# RESUME ANALYTICS
# =========================================================

class ResumeAnalyticsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        try:

            user_id = str(request.user.id)

            resume = resume_collection.find_one(
                {"user_id": user_id},
                sort=[("uploaded_at", -1)]
            )

            # =================================================
            # DEBUG LOGS
            # =================================================

            print("\n========== RESUME ANALYTICS DEBUG ==========")

            print("ANALYTICS USER:", request.user.id)

            print("ANALYTICS DOCUMENT:", resume)

            if resume:

                print(
                    "ANALYTICS AI STATUS:",
                    resume.get("ai_status")
                )

                print(
                    "ANALYTICS AI RESULT:",
                    resume.get("ai_analysis")
                )

            print("============================================\n")

            # =================================================
            # NO RESUME FOUND
            # =================================================

            if not resume:

                return Response({
                    "success": False,
                    "message": "No Resume Found"
                }, status=404)

            # =================================================
            # RESPONSE
            # =================================================

            return Response({

                "success": True,

                "resume_id": str(resume["_id"]),

                "resume_name": resume.get("resume_name", ""),
                "resume_url": resume.get("resume_url", ""),

                "resume_text": resume.get("resume_text", ""),

                "ats_score": resume.get("ats_score", 0),

                "skills": resume.get("skills", []),
                "experience": resume.get("experience", []),
                "education": resume.get("education", []),

                "missing_skills": resume.get("missing_skills", []),

                "ai_analysis": resume.get("ai_analysis", ""),

                "ai_status": resume.get("ai_status", "processing"),

                "uploaded_at": resume.get("uploaded_at")

            })

        except Exception as error:

            print("RESUME ANALYTICS ERROR:", error)

            return Response({
                "success": False,
                "message": str(error)
            }, status=500)
