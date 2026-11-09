
import requests
import json
import re


# =========================================================
# OLLAMA CONFIGURATION
# =========================================================

OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "qwen2.5:1.5b"


# =========================================================
# FALLBACK ANALYSIS
# =========================================================

def fallback_analysis(
    skills=None,
    missing_skills=None,
    ats_score=0,
    job_description="",
    detected_role="General Software Developer"
):

    skills = skills or []
    missing_skills = missing_skills or []

    missing_text = (
        ", ".join(missing_skills)
        if missing_skills
        else "No potential skill gaps identified."
    )

    if job_description:
        assessment_basis = (
            "Resume reviewed against the supplied job description."
        )
    else:
        assessment_basis = (
            f"General resume review for {detected_role}. "
            "Skill gaps are potential improvement areas, "
            "not confirmed employer requirements."
        )

    return f"""
AI analysis unavailable. Rule-based analysis is shown.

PROFESSIONAL RESUME ANALYSIS REPORT
========================================

ATS COMPATIBILITY SCORE: {ats_score}/100

TARGET ROLE:
{detected_role}

ANALYSIS BASIS:
{assessment_basis}

DETECTED TECHNICAL SKILLS:
{", ".join(skills) if skills else "No skills detected"}

POTENTIAL MISSING SKILLS:
{missing_text}

STRENGTHS:
- {len(skills)} technical skills detected in the resume.
- Resume content is available for technical evaluation.
- Backend ATS scoring criteria have been applied.

WEAKNESSES:
- Project descriptions should explain technical implementation.
- Measurable achievements may be missing.
- Work experience should explain individual contributions.

RECOMMENDATIONS:
- Describe projects using problem, solution and technologies.
- Add measurable results wherever they can be verified.
- Include skills supported by actual experience.
- Use clear headings and consistent formatting.

ATS OPTIMIZATION:
- Use standard section headings.
- Avoid unnecessary graphics and text boxes.
- Include relevant keywords naturally.
- Keep dates and job titles consistent.

Note: Live AI feedback could not be generated.
This is a rule-based report.
""".strip()


# =========================================================
# SAFE JSON PARSER
# =========================================================

def parse_ai_json(response_text):

    if not response_text:
        return None

    cleaned = response_text.strip()

    # Remove Markdown code fences
    cleaned = re.sub(
        r"```(?:json)?",
        "",
        cleaned,
        flags=re.IGNORECASE
    )

    cleaned = cleaned.replace("```", "").strip()

    # First try direct JSON parsing
    try:

        data = json.loads(cleaned)

        if isinstance(data, dict):
            return data

    except json.JSONDecodeError:
        pass

    # Safely extract JSON object from response
    decoder = json.JSONDecoder()

    for index, char in enumerate(cleaned):

        if char == "{":

            try:

                data, end_index = decoder.raw_decode(
                    cleaned[index:]
                )

                if isinstance(data, dict):
                    return data

            except json.JSONDecodeError:
                continue

    return None


# =========================================================
# FORMAT PROFESSIONAL REPORT
# =========================================================

def format_analysis_report(
    data,
    ats_score,
    skills,
    missing_skills,
    job_description,
    detected_role="General Software Developer"
):

    def format_list(items):

        if not isinstance(items, list) or not items:
            return "- No specific points identified."

        valid_items = [
            str(item).strip()
            for item in items[:5]
            if str(item).strip()
        ]

        if not valid_items:
            return "- No specific points identified."

        return "\n".join(
            f"- {item}" for item in valid_items
        )

    summary = str(data.get(
        "overall_assessment",
        "Resume analysis completed."
    ))

    role_fit = str(data.get(
        "job_fit",
        "Not assessed"
    ))

    strengths = data.get("strengths", [])
    weaknesses = data.get("weaknesses", [])
    recommendations = data.get("recommendations", [])
    ats_improvements = data.get("ats_improvements", [])

    if job_description:

        missing_text = (
            ", ".join(missing_skills)
            if missing_skills
            else "No missing skills identified by keyword matching."
        )

        analysis_basis = "Supplied Job Description"

    else:

        missing_text = (
            ", ".join(missing_skills)
            if missing_skills
            else "No potential skill gaps identified by the role-based checklist."
        )

        analysis_basis = (
            "Inferred Role - Potential skill gaps, "
            "not confirmed job requirements."
        )

    report = f"""
PROFESSIONAL RESUME ANALYSIS REPORT
========================================

1. ATS COMPATIBILITY SCORE
Score: {ats_score}/100

2. TARGET ROLE
{detected_role}

3. ANALYSIS BASIS
{analysis_basis}

4. OVERALL ASSESSMENT
{summary}

5. JOB FIT
{role_fit}

6. DETECTED TECHNICAL SKILLS
{", ".join(skills) if skills else "No skills detected"}

7. POTENTIAL MISSING SKILLS
{missing_text}

8. KEY STRENGTHS
{format_list(strengths)}

9. WEAKNESSES
{format_list(weaknesses)}

10. PERSONALIZED RECOMMENDATIONS
{format_list(recommendations)}

11. ATS OPTIMIZATION SUGGESTIONS
{format_list(ats_improvements)}

========================================
Note: ATS score is calculated by the backend.
AI feedback is based on extracted resume content.
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
    ats_score=0,
    detected_role="General Software Developer"
):

    skills = skills or []
    missing_skills = missing_skills or []

    resume_text = (resume_text or "").strip()
    job_description = (job_description or "").strip()

    # Validate resume
    if len(resume_text) < 50:

        print("OLLAMA SKIPPED: Resume text is too short")

        return fallback_analysis(
            skills,
            missing_skills,
            ats_score,
            job_description,
            detected_role
        )

    # Limit prompt size
    resume_text = resume_text[:1800]
    job_description = job_description[:500]

    if job_description:

        job_context = f"""
JOB DESCRIPTION:
{job_description}

Evaluate the resume against this job description.
"""

    else:

        job_context = f"""
No job description provided.
Target role: {detected_role}

Evaluate general resume quality for this role.
Treat missing skills as potential gaps only.
"""

    # AI prompt
    prompt = f"""
You are a professional technical resume reviewer.

Analyze only the information in the resume.

Rules:
- Never invent skills, projects or experience.
- Give specific strengths and weaknesses.
- Give practical recommendations.
- Do not calculate or change the ATS score.
- Keep every point short and useful.
- Return valid JSON only.
- Do not include Markdown.
- Do not include explanations outside JSON.
- Complete every JSON field and close all brackets.

ATS SCORE: {ats_score}/100

TARGET ROLE: {detected_role}

DETECTED SKILLS:
{", ".join(skills) if skills else "None"}

POTENTIAL MISSING SKILLS:
{", ".join(missing_skills) if missing_skills else "None"}

{job_context}

RESUME:
{resume_text}

Return JSON in exactly this structure:

{{
    "overall_assessment": "Brief resume assessment",
    "job_fit": "Role fit and reason",
    "strengths": [
        "Specific strength",
        "Specific strength",
        "Specific strength"
    ],
    "weaknesses": [
        "Specific weakness",
        "Specific weakness",
        "Specific weakness"
    ],
    "recommendations": [
        "Practical recommendation",
        "Practical recommendation",
        "Practical recommendation"
    ],
    "ats_improvements": [
        "ATS improvement",
        "ATS improvement",
        "ATS improvement"
    ]
}}
"""

    try:

        print("====================================")
        print("OLLAMA REQUEST STARTED")
        print("MODEL:", OLLAMA_MODEL)
        print("RESUME LENGTH:", len(resume_text))
        print("====================================")

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
                    "num_predict": 700,
                    "num_ctx": 2048
                }
            },
            timeout=(10, 120)
        )

        response.raise_for_status()

        response_data = response.json()

        result = response_data.get(
            "response", ""
        ).strip()

        if not result:
            raise ValueError("Empty response from Ollama")

        print("OLLAMA RESPONSE RECEIVED")
        print("OLLAMA DONE REASON:", response_data.get("done_reason"))
        print("OLLAMA RESPONSE LENGTH:", len(result))
        print("OLLAMA RESPONSE END:", result[-500:])

        # Parse AI response
        analysis_data = parse_ai_json(result)

        if not isinstance(analysis_data, dict):

            raise ValueError(
                "Invalid JSON response from Ollama: "
                + result[:500]
            )

        # Validate required fields
        required_fields = [
            "overall_assessment",
            "job_fit",
            "strengths",
            "weaknesses",
            "recommendations",
            "ats_improvements"
        ]

        missing_fields = [
            field
            for field in required_fields
            if field not in analysis_data
        ]

        if missing_fields:

            raise ValueError(
                "Missing JSON fields: "
                + ", ".join(missing_fields)
            )

        professional_report = format_analysis_report(
            data=analysis_data,
            ats_score=ats_score,
            skills=skills,
            missing_skills=missing_skills,
            job_description=job_description,
            detected_role=detected_role
        )

        print("OLLAMA ANALYSIS SUCCESS")

        return professional_report

    except requests.exceptions.Timeout:

        print("OLLAMA ERROR: Response timeout")

    except requests.exceptions.ConnectionError:

        print("OLLAMA ERROR: Cannot connect to Ollama")

    except requests.exceptions.HTTPError as e:

        print("OLLAMA HTTP ERROR:", str(e))

    except (ValueError, json.JSONDecodeError) as e:

        print("OLLAMA RESPONSE ERROR:", str(e))

    except Exception as e:

        print("OLLAMA RESUME ANALYSIS ERROR:", str(e))

    # Return fallback only when AI fails
    print("USING RULE-BASED FALLBACK ANALYSIS")

    return fallback_analysis(
        skills,
        missing_skills,
        ats_score,
        job_description,
        detected_role
    )
