skills_list = [

    "Python",
    "Java",
    "C++",
    "React",
    "Node.js",
    "MongoDB",
    "Django",
    "REST API",
    "Machine Learning",
    "Deep Learning",
    "TensorFlow",
    "PyTorch",
    "HTML",
    "CSS",
    "JavaScript",
    "SQL",
    "Git",
    "Docker",
    "AWS"
]


def extract_skills(resume_text):

    skills_found = []

    text = resume_text.lower()

    for skill in skills_list:

        if skill.lower() in text:

            skills_found.append(skill)

    return list(set(skills_found))