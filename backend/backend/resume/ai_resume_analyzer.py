
import requests
import json
import re

OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "qwen2.5:1.5b"


# =========================================================
# FALLBACK ANALYSIS
# =========================================================

def fallback_analysis(
    skills=None,
    missing_skills=None,
    ats_score=0,
    job_description=""
):
    skills = skills or []
    missing_skills = missing_skills or []

    if job_description:
        missing_text = (
            ", ".join(missing_skills)
            if missing_skills
            else "No missing skills identified by keyword matching."
        )
    else:
        missing_text = (
            "Not assessed. Provide a Job Description for "
            "job-specific missing skill analysis."
        )

    return f"""
RESUME ANALYSIS REPORT
================================

ATS COMPATIBILITY SCORE: {ats_score}/100

SKILL ANALYSIS
Detected Skills: {", ".join(skills) if skills else "No skills detected"}

MISSING SKILLS
{missing_text}

STRENGTHS
- Resume contains {len(skills)} detected technical skills.
- Technical skills are available for evaluation.

WEAKNESSES
- Project descriptions may need more technical details.
- Add measurable achievements wherever possible.
- Ensure experience descriptions clearly explain your contributions.

RECOMMENDATIONS
- Add relevant projects with technologies used.
- Include measurable results and achievements.
- Improve resume section headings and formatting.
- Tailor your resume to the target job description.

Note: AI service was unavailable. This is a rule-based fallback report.
"""


# =========================================================
# SAFE JSON PARSER
# =========================================================

def parse_ai_json(response_text):

    try:
        return json.loads(response_text)

    except json.JSONDecodeError:
        pass

    # Handle accidental markdown code blocks
    cleaned = re.sub(
        r"```(?:json)?",
        "",
        response_text,
        flags=re.IGNORECASE
    ).replace("```", "").strip()

    try:
        return json.loads(cleaned)

    except json.JSONDecodeError:
        # Try extracting the JSON object
        match = re.search(r"\{.*\}", cleaned, re.DOTALL)

        if match:
            try:
                return json.loads(match.group())
            except json.JSONDecodeError:
                pass

    return None


# =========================================================
# FORMAT PROFESSIONAL REPORT
# =========================================================

def format_analysis_report(
    data,
    ats_score,
    skills,
    missing_skills,
    job_description
):

    def format_list(items):
        if not isinstance(items, list) or not items:
            return "- No specific points identified."

        return "\n".join(
            f"- {str(item)}"
            for item in items[:5]
        )

    summary = data.get(
        "overall_assessment",
        "Resume analysis completed."
    )

    role_fit = data.get(
        "job_fit",
        "Not assessed"
    )

    strengths = data.get("strengths", [])
    weaknesses = data.get("weaknesses", [])
    recommendations = data.get("recommendations", [])
    ats_improvements = data.get("ats_improvements", [])

    # Use backend's actual missing skill list.
    if job_description:
        missing_text = (
            ", ".join(missing_skills)
            if missing_skills
            else "No missing skills identified by keyword matching."
        )
    else:
        missing_text = (
            "Not assessed. Provide a Job Description "
            "for targeted skill gap analysis."
        )

    report = f"""
PROFESSIONAL RESUME ANALYSIS REPORT
========================================

1. ATS COMPATIBILITY SCORE
Score: {ats_score}/100

2. OVERALL ASSESSMENT
{summary}

3. JOB FIT
{role_fit}

4. DETECTED TECHNICAL SKILLS
{", ".join(skills) if skills else "No skills detected"}

5. MISSING SKILLS
{missing_text}

6. KEY STRENGTHS
{format_list(strengths)}

7. WEAKNESSES
{format_list(weaknesses)}

8. PERSONALIZED RECOMMENDATIONS
{format_list(recommendations)}

9. ATS OPTIMIZATION SUGGESTIONS
{format_list(ats_improvements)}

========================================
Note: ATS score is calculated by the backend.
AI feedback is based on the extracted resume content.
"""

    return report.strip()


# =========================================================
# MAIN AI RESUME ANALYZER
# =========================================================

def analyze_resume(
    resume_text,
    job_description="",
    skills=None,
    missing_skills=None,
    ats_score=0
):

    skills = skills or []
    missing_skills = missing_skills or []

    # Validate resume
    if not resume_text or len(resume_text.strip()) < 50:
        return fallback_analysis(
            skills,
            missing_skills,
            ats_score,
            job_description
        )

    # Limit input to improve response speed
    resume_text = resume_text[:4500]
    job_description = (job_description or "")[:1500]

    # Job description condition
    if job_description.strip():

        job_context = f"""
TARGET JOB DESCRIPTION:
{job_description}

The backend has already detected these missing skills:
{", ".join(missing_skills) if missing_skills else "None identified."}

Evaluate the candidate against this specific job.
Do not invent missing skills.
"""

    else:

        job_context = """
No target job description was provided.

Perform a general resume quality review.
Do not claim that any particular job skill is missing.
Set job_fit to "Not assessed - Job Description not provided".
"""

    prompt = f"""
You are an experienced professional ATS resume reviewer
and technical recruitment specialist.

Review the resume carefully and provide specific,
evidence-based feedback.

IMPORTANT RULES:
1. Do not invent experience, projects, qualifications or skills.
2. Do not assume a skill exists unless it is supported by the resume.
3. Do not classify a skill as missing unless it is relevant
   to the supplied job description.
4. Identify vague project descriptions and missing measurable results.
5. Give practical recommendations that the candidate can implement.
6. Do not change or recalculate the provided ATS score.
7. Keep feedback concise, professional and useful.

BACKEND ATS SCORE: {ats_score}/100

DETECTED RESUME SKILLS:
{", ".join(skills)}

{job_context}

RESUME CONTENT:
{resume_text}

Return ONLY valid JSON using this exact structure:

{{
  "overall_assessment": "Short professional assessment",
  "job_fit": "Good / Moderate / Low / Not assessed, with reason",
  "strengths": [
    "Evidence-based strength 1",
    "Evidence-based strength 2",
    "Evidence-based strength 3"
  ],
  "weaknesses": [
    "Specific weakness 1",
    "Specific weakness 2",
    "Specific weakness 3"
  ],
  "recommendations": [
    "Actionable recommendation 1",
    "Actionable recommendation 2",
    "Actionable recommendation 3",
    "Actionable recommendation 4"
  ],
  "ats_improvements": [
    "ATS improvement 1",
    "ATS improvement 2",
    "ATS improvement 3"
  ]
}}

Keep each point short and specific.
"""

    try:

        response = requests.post(
            OLLAMA_URL,
            json={
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False,
                "format": "json",
                "keep_alive": "30m",
                "options": {
                    "temperature": 0.1,
                    "num_predict": 350,
                    "num_ctx": 2048
                }
            },
            timeout=(3, 45)
        )

        response.raise_for_status()

        response_data = response.json()

        result = response_data.get(
            "response",
            ""
        ).strip()

        if not result:
            raise ValueError("Empty response from Ollama")

        # Parse structured JSON
        analysis_data = parse_ai_json(result)

        if not isinstance(analysis_data, dict):
            raise ValueError("Invalid JSON returned by AI model")

        # Convert JSON into readable professional report
        professional_report = format_analysis_report(
            data=analysis_data,
            ats_score=ats_score,
            skills=skills,
            missing_skills=missing_skills,
            job_description=job_description
        )

        print("OLLAMA ANALYSIS SUCCESS")

        return professional_report

    except requests.exceptions.Timeout:

        print("OLLAMA ERROR: Response timeout")

    except requests.exceptions.ConnectionError:

        print("OLLAMA ERROR: Server connection failed")

    except Exception as e:

        print("OLLAMA RESUME ANALYSIS ERROR:", str(e))

    # Fallback if AI is unavailable
    return fallback_analysis(
        skills,
        missing_skills,
        ats_score,
        job_description
    )
