
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
    "Generative AI", "LLM", "NLP", "RAG",
    "LangChain",
    "Power BI", "Tableau", "Excel",
    "C++", "PHP", "Spring Boot",
    "CI/CD", "Unit Testing", "Selenium"
]


# =========================================================
# ROLE REFERENCE SKILLS
# =========================================================

ROLE_PROFILES = {
    "Python Backend Developer": [
        "Python", "Django", "FastAPI", "Flask",
        "REST API", "SQL", "MongoDB", "Git",
        "Docker", "Linux", "Unit Testing", "AWS"
    ],

    "Full Stack Developer": [
        "Python", "JavaScript", "React", "Node.js",
        "HTML", "CSS", "REST API", "SQL",
        "MongoDB", "Git", "Docker", "AWS"
    ],

    "AI / ML Developer": [
        "Python", "Machine Learning", "Deep Learning",
        "Pandas", "NumPy", "Scikit-learn",
        "TensorFlow", "PyTorch", "SQL", "Git"
    ],

    "Generative AI Developer": [
        "Python", "Generative AI", "LLM", "RAG",
        "LangChain", "REST API", "FastAPI",
        "MongoDB", "Git", "Docker"
    ],

    "Data Analyst": [
        "Python", "SQL", "Excel", "Power BI",
        "Tableau", "Pandas", "NumPy"
    ]
}


# =========================================================
# SAFE KEYWORD MATCHING
# =========================================================

def contains_keyword(text, keyword):

    text = (text or "").lower()
    keyword = keyword.strip().lower()

    pattern = (
        r"(?<!\w)"
        + re.escape(keyword)
        + r"(?!\w)"
    )

    return bool(re.search(pattern, text))


# =========================================================
# EXTRACT SKILLS
# =========================================================

def extract_skills(resume_text):

    return [
        skill
        for skill in SKILL_KEYWORDS
        if contains_keyword(resume_text, skill)
    ]


# =========================================================
# INFER ROLE WITHOUT JOB DESCRIPTION
# =========================================================

def infer_target_role(skills):

    skill_set = {
        skill.lower()
        for skill in skills
    }

    role_scores = {}

    for role, required_skills in ROLE_PROFILES.items():

        matched = sum(
            1
            for skill in required_skills
            if skill.lower() in skill_set
        )

        role_scores[role] = (
            matched / len(required_skills)
        )

    if not role_scores:
        return "General Software Developer"

    best_role = max(
        role_scores,
        key=role_scores.get
    )

    if role_scores[best_role] < 0.20:
        return "General Software Developer"

    return best_role


def get_required_skills(role):

    return ROLE_PROFILES.get(
        role,
        [
            "Python",
            "SQL",
            "Git",
            "REST API",
            "Unit Testing",
            "Docker"
        ]
    )


# =========================================================
# EXTRACT EXPERIENCE
# =========================================================

def extract_experience(resume_text):

    keywords = [
        "internship",
        "intern",
        "developer",
        "software engineer",
        "engineer",
        "experience",
        "worked",
        "freelancer",
        "employment",
        "professional experience"
    ]

    text = resume_text.lower()

    return [
        item
        for item in keywords
        if item in text
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

    text = resume_text.lower()

    return [
        item
        for item in keywords
        if item.lower() in text
    ]


# =========================================================
# PROFESSIONAL ATS SCORE
# =========================================================

def calculate_ats_score(
    resume_text,
    skills,
    job_description=""
):

    text = (resume_text or "").lower()
    word_count = len((resume_text or "").split())

    # -----------------------------------------------------
    # 1. SKILL MATCH - 30 POINTS
    # -----------------------------------------------------

    if job_description and job_description.strip():

        required_skills = [
            skill
            for skill in SKILL_KEYWORDS
            if contains_keyword(job_description, skill)
        ]

        analysis_basis = "Job Description"

    else:

        inferred_role = infer_target_role(skills)

        required_skills = get_required_skills(
            inferred_role
        )

        analysis_basis = "Inferred Role"

    skill_set = {
        skill.lower()
        for skill in skills
    }

    matched_skills = [
        skill
        for skill in required_skills
        if skill.lower() in skill_set
    ]

    missing_skills = [
        skill
        for skill in required_skills
        if skill.lower() not in skill_set
    ]

    if required_skills:

        skill_score = round(
            30 * len(matched_skills) / len(required_skills)
        )

    else:

        skill_score = 0

    # -----------------------------------------------------
    # 2. EXPERIENCE - 15 POINTS
    # -----------------------------------------------------

    experience_score = 0

    has_experience_section = bool(
        re.search(
            r"professional experience|work experience|employment history",
            text
        )
    )

    has_internship_or_role = bool(
        re.search(
            r"\bintern(ship)?\b|\bdeveloper\b|\bengineer\b",
            text
        )
    )

    has_dates = bool(
        re.search(
            r"\b(19\d{2}|20\d{2})\b",
            text
        )
    )

    has_action_words = bool(
        re.search(
            r"\b(developed|implemented|built|designed|"
            r"created|tested|maintained|automated)\b",
            text
        )
    )

    has_achievements = bool(
        re.search(
            r"\b(increased|reduced|improved|achieved|"
            r"optimized|delivered|saved)\b",
            text
        )
    )

    if has_experience_section:
        experience_score += 4

    if has_internship_or_role:
        experience_score += 3

    if has_dates:
        experience_score += 2

    if has_action_words:
        experience_score += 3

    if has_achievements:
        experience_score += 3

    experience_score = min(15, experience_score)

    # -----------------------------------------------------
    # 3. EDUCATION - 10 POINTS
    # -----------------------------------------------------

    education_score = 0

    if re.search(
        r"education|bachelor|master|b\.e|b\.tech|degree",
        text
    ):
        education_score += 5

    if re.search(
        r"university|college|engineering|institute",
        text
    ):
        education_score += 3

    if re.search(
        r"\b(19\d{2}|20\d{2})\b|cgpa|gpa|percentage",
        text
    ):
        education_score += 2

    education_score = min(10, education_score)

    # -----------------------------------------------------
    # 4. PROJECTS - 15 POINTS
    # -----------------------------------------------------

    project_score = 0

    has_project_section = bool(
        re.search(
            r"projects|academic projects|personal projects",
            text
        )
    )

    has_project_action = bool(
        re.search(
            r"developed|implemented|designed|built|created",
            text
        )
    )

    has_technology_details = bool(
        re.search(
            r"using|technologies|technology|framework|database",
            text
        )
    )

    has_project_result = bool(
        re.search(
            r"result|improved|reduced|increased|automated|"
            r"performance|accuracy|efficiency",
            text
        )
    )

    if has_project_section:
        project_score += 5

    if has_project_action:
        project_score += 4

    if has_technology_details:
        project_score += 3

    if has_project_result:
        project_score += 3

    project_score = min(15, project_score)

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
        3
        for pattern in section_patterns
        if re.search(pattern, text)
    )

    section_score = min(15, section_score)

    # -----------------------------------------------------
    # 6. CONTACT DETAILS - 10 POINTS
    # -----------------------------------------------------

    contact_score = 0

    email_pattern = (
        r"\b[A-Za-z0-9._%+-]+"
        r"@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b"
    )

    phone_pattern = (
        r"(?:\+?\d[\d\s().-]{8,}\d)"
    )

    if re.search(email_pattern, resume_text):
        contact_score += 5

    if re.search(phone_pattern, resume_text):
        contact_score += 5

    # -----------------------------------------------------
    # 7. READABILITY - 5 POINTS
    # -----------------------------------------------------

    readability_score = 0

    if 200 <= word_count <= 1000:
        readability_score += 2

    elif 100 <= word_count < 200:
        readability_score += 1

    elif 1000 < word_count <= 1200:
        readability_score += 1

    if len(re.findall(r"\n", resume_text)) >= 8:
        readability_score += 1

    if re.search(r"[-•*]", resume_text):
        readability_score += 1

    if not re.search(r"(.)\1{8,}", resume_text):
        readability_score += 1

    readability_score = min(5, readability_score)

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

    total_score = sum(breakdown.values())

    total_score = max(
        0,
        min(100, total_score)
    )

    if total_score >= 85:
        rating = "Excellent"

    elif total_score >= 70:
        rating = "Good"

    elif total_score >= 50:
        rating = "Needs Improvement"

    else:
        rating = "Poor"

    print("ATS ANALYSIS BASIS:", analysis_basis)
    print("ATS SCORE:", total_score)
    print("ATS BREAKDOWN:", breakdown)
    print("MISSING SKILLS:", missing_skills)

    return (
        total_score,
        missing_skills,
        breakdown,
        rating
    )


# =========================================================
# BACKGROUND AI ANALYSIS
# =========================================================

def run_background_analysis(
    resume_id,
    resume_text,
    job_description,
    skills,
    missing_skills,
    ats_score,
    detected_role
):

    try:

        print("AI ANALYSIS STARTED:", resume_id)

        analysis = analyze_resume(
            resume_text=resume_text,
            job_description=job_description,
            skills=skills,
            missing_skills=missing_skills,
            ats_score=ats_score,
            detected_role=detected_role
        )

        if (
            not analysis
            or analysis.lstrip().startswith(
                "AI analysis unavailable"
            )
        ):

            ai_status = "fallback"

            if not analysis:
                analysis = (
                    "AI analysis unavailable. "
                    "Please check your Ollama server and model."
                )

        else:

            ai_status = "completed"

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

            # GET FILE
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

            if uploaded_file.size > 10 * 1024 * 1024:

                return Response({
                    "success": False,
                    "message": "PDF size must be below 10 MB"
                }, status=400)

            # SAVE PDF
            resume_dir = os.path.join(
                settings.MEDIA_ROOT,
                "resumes"
            )

            os.makedirs(
                resume_dir,
                exist_ok=True
            )

            fs = FileSystemStorage(
                location=resume_dir,
                base_url=(
                    f"{settings.MEDIA_URL.rstrip('/')}/resumes/"
                )
            )

            filename = fs.save(
                uploaded_file.name,
                uploaded_file
            )

            file_path = fs.path(filename)

            file_url = request.build_absolute_uri(
                fs.url(filename)
            )

            # EXTRACT PDF TEXT
            with fitz.open(file_path) as pdf:

                resume_text = "\n".join(
                    page.get_text("text")
                    for page in pdf
                ).strip()

            if len(resume_text) < 50:

                return Response({
                    "success": False,
                    "message": (
                        "Unable to extract resume text. "
                        "Please upload a text-based PDF."
                    )
                }, status=400)

            # EXTRACT SKILLS
            extracted_skills = extract_skills(
                resume_text
            )

            # EXTRACT EXPERIENCE
            extracted_experience = extract_experience(
                resume_text
            )

            # EXTRACT EDUCATION
            extracted_education = extract_education(
                resume_text
            )

            # JOB DESCRIPTION
            job_description = str(
                request.data.get("job_description", "")
            ).strip()

            # INFER ROLE
            detected_role = infer_target_role(
                extracted_skills
            )

            # ATS SCORE
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

            analysis_basis = (
                "Job Description"
                if job_description
                else "Inferred Role"
            )

            # SAVE TO MONGODB
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

                "detected_role": detected_role,

                "analysis_basis": analysis_basis,

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

            # START AI IN BACKGROUND
            thread = threading.Thread(
                target=run_background_analysis,
                args=(
                    result.inserted_id,
                    resume_text,
                    job_description,
                    extracted_skills,
                    missing_skills,
                    ats_score,
                    detected_role
                ),
                daemon=True
            )

            thread.start()

            # IMMEDIATE RESPONSE
            return Response({

                "success": True,

                "message": "Resume uploaded successfully",

                "resume_id": str(result.inserted_id),

                "resume_name": filename,

                "resume_url": file_url,

                "skills": extracted_skills,

                "experience": extracted_experience,

                "education": extracted_education,

                "missing_skills": missing_skills,

                "detected_role": detected_role,

                "analysis_basis": analysis_basis,

                "ats_score": ats_score,

                "ats_rating": rating,

                "ats_breakdown": ats_breakdown,

                "ai_status": "processing",

                "ai_analysis": ""

            }, status=200)

        except Exception as e:

            print("RESUME UPLOAD ERROR:", str(e))

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

            user_id = str(request.user.id)

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

                "resume_name": resume.get("resume_name"),

                "resume_url": resume.get("resume_url"),

                "ats_score": resume.get("ats_score", 0),

                "ats_rating": resume.get(
                    "ats_rating",
                    "Not Available"
                ),

                "ats_breakdown": resume.get(
                    "ats_breakdown",
                    {}
                ),

                "skills": resume.get("skills", []),

                "experience": resume.get("experience", []),

                "education": resume.get("education", []),

                "missing_skills": resume.get(
                    "missing_skills",
                    []
                ),

                "detected_role": resume.get(
                    "detected_role",
                    ""
                ),

                "analysis_basis": resume.get(
                    "analysis_basis",
                    ""
                ),

                "job_description": resume.get(
                    "job_description",
                    ""
                ),

                "ai_status": resume.get(
                    "ai_status",
                    "processing"
                ),

                "ai_analysis": resume.get(
                    "ai_analysis",
                    ""
                ),

                "uploaded_at": resume.get("uploaded_at")

            })

        except Exception as e:

            print("RESUME ANALYTICS ERROR:", str(e))

            return Response({

                "success": False,

                "message": str(e)

            }, status=500)
