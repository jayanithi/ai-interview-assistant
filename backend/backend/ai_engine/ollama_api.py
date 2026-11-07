import requests

def generate_content(prompt):

    try:

        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "llama3",
                "prompt": prompt,
                "stream": False
            },
            timeout=300
        )

        print(response.status_code)

        if response.status_code != 200:
            print(response.text)
            return ""

        data = response.json()

        return data.get(
            "response",
            ""
        )

    except Exception as e:

        print("OLLAMA ERROR:", e)

        return ""