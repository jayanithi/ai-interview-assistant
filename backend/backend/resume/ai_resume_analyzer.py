from ai_engine.ollama_api import generate_content


def analyze_resume(resume_text):

    if not resume_text or not resume_text.strip():
        return "AI analysis unavailable. No resume text was provided."

    prompt = f"""
You are an experienced resume reviewer.

Analyze the resume below. Base your feedback only on information
present in the resume. Do not invent experience, qualifications,
projects, or skills.

Resume:
{resume_text}

Provide a clear and practical analysis using exactly these sections:

Strengths:
- List the candidate's strongest points.

Weaknesses:
- List areas that need improvement.

Missing Skills:
- List relevant skills that are not evident in the resume.

Recommendations:
- Give specific suggestions to improve the resume and its ATS readability.
"""

    response = generate_content(prompt)

    if not response or not response.strip():
        return (
            "AI analysis unavailable. Please make sure Ollama is running "
            "and the llama3 model is installed."
        )

    return response.strip()
