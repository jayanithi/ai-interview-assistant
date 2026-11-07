import openai

openai.api_key = ''


def generate_question(skills):

    prompt = f'''
    Generate one technical interview question for:
    {skills}
    '''

    response = openai.ChatCompletion.create(
        model='gpt-3.5-turbo',
        messages=[
            {
                'role': 'user',
                'content': prompt
            }
        ]
    )

    return response['choices'][0]['message']['content']