from ai_engine.ollama_api import generate_content

def analyze_resume(resume_text):

    prompt = f"""
Analyze this resume.

Resume:
{resume_text}

Return:

Strengths:
Weaknesses:
Missing Skills:
Recommendations:
"""

    response = generate_content(prompt)

    return response