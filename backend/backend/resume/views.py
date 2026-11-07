
# =========================================================
# resume/views.py
# PROFESSIONAL ATS RESUME CHECKER
# FAST UPLOAD + BACKGROUND AI ANALYSIS
# =========================================================

import os
import re
import threading

from datetime import datetime

import fitz

from django.conf import settings
from django.core.files.storage import FileSystemStorage

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from resume.ai_resume_analyzer import analyze_resume

from database.mongo import resume_collection


# =========================================================
# SKILL DATABASE
# =========================================================

SKILL_KEYWORDS = [

    "Python", "Java", "JavaScript", "TypeScript",
    "React", "Node.js", "Express.js",
    "Django", "Flask", "FastAPI",

    "MongoDB", "MySQL", "PostgreSQL", "Redis",
    "Firebase", "SQL",

    "Docker", "Kubernetes", "AWS", "Azure",
    "Git", "GitHub", "Linux",

    "REST API", "GraphQL",

    "HTML", "CSS", "Bootstrap",

    "TensorFlow", "PyTorch", "Pandas",
    "NumPy", "Scikit-learn",

    "Machine Learning", "Deep Learning",
    "Artificial Intelligence",
    "Generative AI", "LLM", "NLP",

    "Power BI", "Tableau", "Excel",

    "C", "C++", "PHP", "Spring Boot"

]


# =========================================================
# HELPER: SAFE KEYWORD MATCHING
# =========================================================

def contains_keyword(text, keyword):

    pattern = (
        r"(?<!\w)"
        + re.escape(keyword.lower())
        + r"(?!\w)"
    )

    return bool(
        re.search(pattern, text.lower())
    )


# =========================================================
# EXTRACT SKILLS
# =========================================================

def extract_skills(resume_text):

    skills = []

    for skill in SKILL_KEYWORDS:

        if contains_keyword(
            resume_text,
            skill
        ):

            skills.append(skill)

    return skills


# =========================================================
# EXTRACT EXPERIENCE
# =========================================================

def extract_experience(resume_text):

    keywords = [

        "intern",
        "internship",
        "developer",
        "software engineer",
        "engineer",
        "experience",
        "worked",
        "freelancer",
        "employment",
        "professional experience"

    ]

    return [

        item for item in keywords

        if item in resume_text.lower()

    ]


# =========================================================
# EXTRACT EDUCATION
# =========================================================

def extract_education(resume_text):

    keywords = [

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
        "CGPA",
        "GPA"

    ]

    return [

        item for item in keywords

        if item.lower() in resume_text.lower()

    ]


# =========================================================
# PROFESSIONAL ATS SCORE
# =========================================================

def calculate_ats_score(
    resume_text,
    skills,
    job_description=""
):

    text = resume_text.lower()

    # -----------------------------------------------------
    # 1. SKILL MATCH - 30 POINTS
    # -----------------------------------------------------

    if job_description:

        required_skills = [

            skill for skill in SKILL_KEYWORDS

            if contains_keyword(
                job_description,
                skill
            )

        ]

        if required_skills:

            matched_skills = [

                skill for skill in required_skills

                if skill in skills

            ]

            skill_score = round(

                30 * len(matched_skills)
                / len(required_skills)

            )

            missing_skills = [

                skill for skill in required_skills

                if skill not in skills

            ]

        else:

            skill_score = min(
                30,
                len(skills) * 3
            )

            missing_skills = []

    else:

        matched_skills = skills

        skill_score = min(
            30,
            len(skills) * 3
        )

        missing_skills = []

    # -----------------------------------------------------
    # 2. EXPERIENCE - 15 POINTS
    # -----------------------------------------------------

    experience_score = 0

    if re.search(
        r"experience|employment|work history",
        text
    ):
        experience_score += 5

    if re.search(
        r"internship|intern|developer|engineer",
        text
    ):
        experience_score += 5

    if re.search(
        r"worked|responsibilities|achievements",
        text
    ):
        experience_score += 5

    experience_score = min(
        experience_score,
        15
    )

    # -----------------------------------------------------
    # 3. EDUCATION - 10 POINTS
    # -----------------------------------------------------

    education_score = 0

    if re.search(
        r"education|bachelor|master|b\.e|b\.tech|degree",
        text
    ):
        education_score += 6

    if re.search(
        r"university|college|engineering|cgpa|gpa",
        text
    ):
        education_score += 4

    # -----------------------------------------------------
    # 4. PROJECTS - 15 POINTS
    # -----------------------------------------------------

    project_score = 0

    if re.search(
        r"projects|academic projects|personal projects",
        text
    ):
        project_score += 7

    if re.search(
        r"developed|implemented|designed|built",
        text
    ):
        project_score += 4

    if re.search(
        r"github|deployment|live demo",
        text
    ):
        project_score += 4

    # -----------------------------------------------------
    # 5. RESUME SECTIONS - 15 POINTS
    # -----------------------------------------------------

    section_patterns = [

        r"summary|objective|profile",

        r"skills|technical skills",

        r"experience|employment",

        r"projects",

        r"education|academic"

    ]

    section_score = sum(

        3 for pattern in section_patterns

        if re.search(pattern, text)

    )

    # -----------------------------------------------------
    # 6. CONTACT DETAILS - 10 POINTS
    # -----------------------------------------------------

    contact_score = 0

    email_pattern = (
        r"\b[A-Za-z0-9._%+-]+"
        r"@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b"
    )

    if re.search(
        email_pattern,
        resume_text
    ):
        contact_score += 5

    phone_pattern = (
        r"(?:\+?\d[\d\s().-]{8,}\d)"
    )

    if re.search(
        phone_pattern,
        resume_text
    ):
        contact_score += 5

    # -----------------------------------------------------
    # 7. READABILITY - 5 POINTS
    # -----------------------------------------------------

    readability_score = 0

    word_count = len(
        resume_text.split()
    )

    if word_count >= 100:
        readability_score += 2

    if word_count >= 200:
        readability_score += 3

    # -----------------------------------------------------
    # FINAL SCORE
    # -----------------------------------------------------

    breakdown = {

        "skills": skill_score,

        "experience": experience_score,

        "education": education_score,

        "projects": project_score,

        "sections": section_score,

        "contact": contact_score,

        "readability": readability_score

    }

    total_score = sum(
        breakdown.values()
    )

    total_score = min(
        100,
        max(0, total_score)
    )

    if total_score >= 85:
        rating = "Excellent"

    elif total_score >= 70:
        rating = "Good"

    elif total_score >= 50:
        rating = "Needs Improvement"

    else:
        rating = "Poor"

    return (
        total_score,
        missing_skills,
        breakdown,
        rating
    )


# =========================================================
# BACKGROUND AI ANALYSIS
# =========================================================


# =========================================================
# BACKGROUND AI ANALYSIS
# =========================================================

def run_background_analysis(
    resume_id,
    resume_text,
    job_description,
    skills,
    missing_skills,
    ats_score
):
    try:
        print("AI ANALYSIS STARTED:", resume_id)

        # Generate AI Resume Analysis
        analysis = analyze_resume(
            resume_text=resume_text,
            job_description=job_description,
            skills=skills,
            missing_skills=missing_skills,
            ats_score=ats_score
        )

        # Check whether actual AI analysis or fallback was returned
        if (
            not analysis
            or analysis.lstrip().startswith("AI analysis unavailable")
        ):
            ai_status = "fallback"

            if not analysis:
                analysis = (
                    "AI analysis unavailable. "
                    "Please check your Ollama server and model."
                )

        else:
            ai_status = "completed"

        # Update MongoDB
        resume_collection.update_one(
            {"_id": resume_id},
            {
                "$set": {
                    "ai_analysis": analysis,
                    "ai_status": ai_status,
                    "ai_completed_at": datetime.utcnow()
                }
            }
        )

        print("AI ANALYSIS STATUS:", ai_status)
        print("AI ANALYSIS SAVED:", resume_id)

    except Exception as e:

        print("BACKGROUND AI ERROR:", str(e))

        resume_collection.update_one(
            {"_id": resume_id},
            {
                "$set": {
                    "ai_status": "failed",
                    "ai_analysis": (
                        "AI analysis failed. "
                        "Please check Ollama and try again."
                    ),
                    "ai_error": str(e),
                    "ai_completed_at": datetime.utcnow()
                }
            }
        )

        print("AI ANALYSIS FAILED:", resume_id)



# =========================================================
# RESUME UPLOAD VIEW
# =========================================================

class ResumeUploadView(APIView):

    permission_classes = [IsAuthenticated]

    parser_classes = (
        MultiPartParser,
        FormParser
    )

    def post(self, request):

        try:

            # ------------------------------------------------
            # GET FILE
            # ------------------------------------------------

            uploaded_file = request.FILES.get(
                "file"
            )

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

            if uploaded_file.size > 10 * 1024 * 1024:

                return Response({

                    "success": False,

                    "message": "PDF size must be below 10 MB"

                }, status=400)

            # ------------------------------------------------
            # SAVE PDF
            # ------------------------------------------------

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

            # ------------------------------------------------
            # EXTRACT PDF TEXT
            # ------------------------------------------------

            with fitz.open(file_path) as pdf:

                resume_text = "\n".join(

                    page.get_text("text")

                    for page in pdf

                ).strip()

            if len(resume_text) < 50:

                return Response({

                    "success": False,

                    "message":
                    "Unable to extract resume text. Please upload a text-based PDF."

                }, status=400)

            # ------------------------------------------------
            # SKILLS
            # ------------------------------------------------

            extracted_skills = extract_skills(
                resume_text
            )

            # ------------------------------------------------
            # EXPERIENCE
            # ------------------------------------------------

            extracted_experience = extract_experience(
                resume_text
            )

            # ------------------------------------------------
            # EDUCATION
            # ------------------------------------------------

            extracted_education = extract_education(
                resume_text
            )

            # ------------------------------------------------
            # JOB DESCRIPTION
            # ------------------------------------------------

            job_description = request.data.get(
                "job_description",
                ""
            ).strip()

            # ------------------------------------------------
            # ATS SCORE
            # ------------------------------------------------

            (
                ats_score,
                missing_skills,
                ats_breakdown,
                rating

            ) = calculate_ats_score(

                resume_text,

                extracted_skills,

                job_description

            )

            # ------------------------------------------------
            # SAVE TO MONGODB
            # ------------------------------------------------

            user_id = str(
                request.user.id
            )

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

                "ats_rating": rating,

                "ats_breakdown": ats_breakdown,

                "job_description": job_description,

                "ai_analysis": "",

                "ai_status": "processing",

                "uploaded_at": datetime.utcnow()

            }

            result = resume_collection.insert_one(
                resume_document
            )

            # ------------------------------------------------
            # START AI IN BACKGROUND
            # ------------------------------------------------

            thread = threading.Thread(

                target=run_background_analysis,

                args=(

                    result.inserted_id,

                    resume_text,

                    job_description,

                    extracted_skills,

                    missing_skills,

                    ats_score

                ),

                daemon=True

            )

            thread.start()

            # ------------------------------------------------
            # IMMEDIATE RESPONSE
            # ------------------------------------------------

            return Response({

                "success": True,

                "message":
                "Resume uploaded successfully",

                "resume_id":
                str(result.inserted_id),

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

                "ats_rating":
                rating,

                "ats_breakdown":
                ats_breakdown,

                "ai_status":
                "processing",

                "ai_analysis":
                ""

            }, status=200)

        except Exception as e:

            print(
                "RESUME UPLOAD ERROR:",
                str(e)
            )

            return Response({

                "success": False,

                "message": str(e)

            }, status=500)


# =========================================================
# RESUME ANALYTICS VIEW
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

                    "message": "No Resume Found"

                }, status=404)

            return Response({

                "success": True,

                "resume_id": str(resume["_id"]),

                "resume_name":
                resume.get("resume_name"),

                "resume_url":
                resume.get("resume_url"),

                "ats_score":
                resume.get("ats_score", 0),

                "ats_rating":
                resume.get("ats_rating", "Not Available"),

                "ats_breakdown":
                resume.get("ats_breakdown", {}),

                "skills":
                resume.get("skills", []),

                "experience":
                resume.get("experience", []),

                "education":
                resume.get("education", []),

                "missing_skills":
                resume.get("missing_skills", []),

                "ai_status":
                resume.get("ai_status", "processing"),

                "ai_analysis":
                resume.get("ai_analysis", ""),

                "uploaded_at":
                resume.get("uploaded_at")

            })

        except Exception as e:

            print(
                "RESUME ANALYTICS ERROR:",
                str(e)
            )

            return Response({

                "success": False,

                "message": str(e)

            }, status=500)
