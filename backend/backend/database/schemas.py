# ==========================================
# database/schemas.py
# ==========================================

from datetime import datetime


# ==========================================
# USER SCHEMA
# ==========================================

def user_schema(data):

    return {

        "username":
        data.get("username", ""),

        "email":
        data.get("email", ""),

        "password":
        data.get("password", ""),

        "phone":
        data.get("phone", ""),

        "avatar":
        data.get("avatar", ""),

        "role":
        data.get("role", "user"),

        "created_at":
        datetime.utcnow(),

        "last_login":
        datetime.utcnow(),
    }


# ==========================================
# RESUME SCHEMA
# ==========================================

def resume_schema(data):

    return {

        "user_id":
        data.get("user_id"),

        "resume_name":
        data.get("resume_name", ""),

        "resume_url":
        data.get("resume_url", ""),

        "skills":
        data.get("skills", []),

        "experience":
        data.get("experience", ""),

        "education":
        data.get("education", ""),

        "uploaded_at":
        datetime.utcnow(),
    }


# ==========================================
# INTERVIEW SCHEMA
# ==========================================

def interview_schema(data):

    return {

        "user_id":
        data.get("user_id"),

        "domain":
        data.get("domain", ""),

        "question":
        data.get("question", ""),

        "answer":
        data.get("answer", ""),

        "score":
        data.get("score", 0),

        "feedback":
        data.get("feedback", ""),

        "created_at":
        datetime.utcnow(),
    }


# ==========================================
# ANALYTICS SCHEMA
# ==========================================

def analytics_schema(data):

    return {

        "user_id":
        data.get("user_id"),

        "total_interviews":
        data.get("total_interviews", 0),

        "average_score":
        data.get("average_score", 0),

        "best_score":
        data.get("best_score", 0),

        "weak_topics":
        data.get("weak_topics", []),

        "strong_topics":
        data.get("strong_topics", []),

        "updated_at":
        datetime.utcnow(),
    }


# ==========================================
# SETTINGS SCHEMA
# ==========================================

def settings_schema(data):

    return {

        "user_id":
        data.get("user_id"),

        "notifications":
        data.get("notifications", True),

        "dark_mode":
        data.get("dark_mode", True),

        "two_factor":
        data.get("two_factor", False),

        "updated_at":
        datetime.utcnow(),
    }


# ==========================================
# REPORT SCHEMA
# ==========================================

def report_schema(data):

    return {

        "user_id":
        data.get("user_id"),

        "report_name":
        data.get("report_name", ""),

        "score":
        data.get("score", 0),

        "report_url":
        data.get("report_url", ""),

        "generated_at":
        datetime.utcnow(),
    }