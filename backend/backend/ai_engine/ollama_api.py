
import requests

def generate_content(prompt):

    try:
        print("OLLAMA: Connecting to server...")

        response = requests.post(
            "http://127.0.0.1:11434/api/generate",
            json={
                "model": "llama3",
                "prompt": prompt,
                "stream": False
            },
            timeout=300
        )

        print("OLLAMA STATUS:", response.status_code)

        response.raise_for_status()

        data = response.json()

        print("OLLAMA: Response received successfully!")

        return data.get("response", "")

    except requests.exceptions.ConnectionError as e:
        print("OLLAMA CONNECTION ERROR:", e)
        return ""

    except requests.exceptions.Timeout:
        print("OLLAMA TIMEOUT ERROR")
        return ""

    except Exception as e:
        print("OLLAMA ERROR:", e)
        return ""
