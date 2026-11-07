from ai_engine.ollama_api import generate_content

def generate_interview_questions(role, skills):

    prompt = f"""
You are an expert {role} interviewer.

Generate EXACTLY 7 interview questions ONLY.

Role: {role}

Skills:
{', '.join(skills)}

Rules:
- One question per line
- No numbering
- No explanation
- Exactly 7 questions
"""

    result = generate_content(prompt)

    if not result:
        return [
            f"What is your experience with {skills[0]}?",
            f"Explain a project using {skills[1]}.",
            f"What are the advantages of {skills[2]}?",
            f"When would you use {skills[3]}?",
            f"What challenges have you faced in {role} development?",
            f"How do you debug applications?",
            f"Why should we hire you?"
        ]

    questions = []

    for line in result.split("\n"):

        line = line.strip()

        if "?" in line:
            questions.append(line)

    return questions[:7]