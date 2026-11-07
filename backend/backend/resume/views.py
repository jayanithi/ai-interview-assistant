# =========================================================
# resume/views.py
# =========================================================

import os
import fitz

from datetime import datetime

from django.conf import settings
from django.core.files.storage import FileSystemStorage

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from pymongo import MongoClient

from resume.ai_resume_analyzer import analyze_resume
from database.mongo import resume_collection



# =========================================================
# MONGODB
# =========================================================

client = MongoClient(
    "mongodb://localhost:27017/"
)

db = client["interview_ai"]

resume_collection = db["resumes"]


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

            uploaded_file = request.FILES.get(
                "file"
            )

            if not uploaded_file:
                return Response({
                    "success": False,
                    "message": "No File Uploaded"
                }, status=400)

            if not uploaded_file.name.lower().endswith(
                ".pdf"
            ):
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

            os.makedirs(
                resume_dir,
                exist_ok=True
            )

            fs = FileSystemStorage(
                location=resume_dir
            )

            filename = fs.save(
                uploaded_file.name,
                uploaded_file
            )

            file_path = fs.path(
                filename
            )

            file_url = (
                request.build_absolute_uri(
                    settings.MEDIA_URL
                )
                + "resumes/"
                + filename
            )

            # =================================================
            # EXTRACT PDF TEXT
            # =================================================

            pdf = fitz.open(
                file_path
            )

            resume_text = ""

            for page in pdf:
                resume_text += page.get_text()

            pdf.close()

            resume_text = resume_text.strip()

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

            extracted_skills = []

            for skill in skill_keywords:

                if skill.lower() in resume_text.lower():

                    extracted_skills.append(
                        skill
                    )

            extracted_skills = list(
                set(extracted_skills)
            )

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

            extracted_experience = []

            for item in experience_keywords:

                if item.lower() in resume_text.lower():

                    extracted_experience.append(
                        item
                    )

            extracted_experience = list(
                set(extracted_experience)
            )

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

            extracted_education = []

            for item in education_keywords:

                if item.lower() in resume_text.lower():

                    extracted_education.append(
                        item
                    )

            extracted_education = list(
                set(extracted_education)
            )

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

            missing_skills = [

                skill

                for skill in required_skills

                if skill not in extracted_skills
            ]

            # =================================================
            # ATS SCORE
            # =================================================

            ats_score = 0

            ats_score += min(
                len(extracted_skills) * 4,
                40
            )

            ats_score += min(
                len(extracted_experience) * 5,
                30
            )

            ats_score += min(
                len(extracted_education) * 3,
                15
            )

            if len(resume_text) > 1000:
                ats_score += 15

            ats_score = min(
                ats_score,
                100
            )

            # =================================================
            # AI ANALYSIS
            # =================================================

            try:

                ai_analysis = analyze_resume(
                    resume_text
                )

            except Exception:

                ai_analysis = (
                    "AI analysis unavailable"
                )

            # =================================================
            # USER ID
            # =================================================

            user_id = str(
                request.user.id
            )

            # =================================================
            # SAVE TO MONGODB
            # =================================================

            resume_collection.insert_one({

                "user_id":
                user_id,

                "resume_name":
                filename,

                "resume_url":
                file_url,

                "resume_text":
                resume_text,

                "skills":
                extracted_skills,

                "experience":
                extracted_experience,

                "education":
                extracted_education,

                "missing_skills":
                missing_skills,

                "ats_score":
                ats_score,

                "ai_analysis":
                ai_analysis,

                "uploaded_at":
                datetime.utcnow()
            })

            # =================================================
            # RESPONSE
            # =================================================

            return Response({

                "success": True,

                "message":
                "Resume Uploaded Successfully",

                "resume_name":
                filename,

                "resume_url":
                file_url,

                "skills":
                extracted_skills,

                "experience":
                extracted_experience,

                "education":
                extracted_education,

                "missing_skills":
                missing_skills,

                "ats_score":
                ats_score,

                "ai_analysis":
                ai_analysis

            })

        except Exception as e:

            return Response({

                "success": False,

                "message": str(e)

            }, status=500) # =========================================================
# RESUME ANALYTICS
# =========================================================

class ResumeAnalyticsView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        try:

            user_id = str(
                request.user.id
            )

            resume = resume_collection.find_one(
                {
                    "user_id": user_id
                },
                sort=[
                    ("uploaded_at", -1)
                ]
            )

            if not resume:

                return Response({

                    "success": False,

                    "message":
                    "No Resume Found"

                }, status=404)

            return Response({

                "success": True,

                "resume_name":
                resume.get(
                    "resume_name"
                ),

                "resume_url":
                resume.get(
                    "resume_url"
                ),

                "ats_score":
                resume.get(
                    "ats_score",
                    0
                ),

                "skills":
                resume.get(
                    "skills",
                    []
                ),

                "experience":
                resume.get(
                    "experience",
                    []
                ),

                "education":
                resume.get(
                    "education",
                    []
                ),

                "missing_skills":
                resume.get(
                    "missing_skills",
                    []
                ),

                "ai_analysis":
                resume.get(
                    "ai_analysis",
                    ""
                ),

                "uploaded_at":
                resume.get(
                    "uploaded_at"
                )

            })

        except Exception as e:

            return Response({

                "success": False,

                "message":
                str(e)

            }, status=500)