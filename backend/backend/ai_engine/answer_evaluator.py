from ai_engine.ollama_api import generate_content
import json
import re


def evaluate_answer(question, answer, role="General"):

    prompt = f"""
You are a Senior Technical Interviewer.

Evaluate the candidate answer.

Role:
{role}

Question:
{question}

Answer:
{answer}

Score based on:

1. Technical Accuracy (0-40)
2. Communication Skill (0-20)
3. Problem Solving (0-20)
4. Confidence & Clarity (0-20)

Return ONLY JSON.

Example:

{{
    "technical_score": 35,
    "communication_score": 18,
    "problem_solving_score": 17,
    "confidence_score": 16,
    "overall_score": 86,
    "feedback": "Strong technical knowledge. Improve clarity."
}}
"""

    result = generate_content(prompt)

    try:

        json_match = re.search(
            r"\{.*\}",
            result,
            re.DOTALL
        )

        if json_match:

            data = json.loads(
                json_match.group()
            )

            return data

    except Exception:
        pass

    return {

        "technical_score": 0,
        "communication_score": 0,
        "problem_solving_score": 0,
        "confidence_score": 0,
        "overall_score": 0,
        "feedback": "Evaluation failed"

    }