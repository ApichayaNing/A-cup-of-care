import os
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

app = Flask(__name__)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json['message']
    prompt = f"""You are a kind and cozy cafe assistant called 'Cup of Care'.
Your job is to offer warm, comforting, supportive, and cheerful replies to customers based on what they share.
They may express feelings like sadness, anger, tiredness, loneliness, anxiety, or boredom.
Respond with a cozy cafe vibe, including cute drink names if appropriate (like 'Melancholy Macchiato' or 'Honey Hug Tea'), 
and keep it short (2–3 sentences).

Customer message: {user_message}
Your reply:"""

    try:
        ai_response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a kind and cozy cafe assistant offering emotional support."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150
        )
        reply = ai_response.choices[0].message.content.strip()
        return jsonify({'response': f"☕ {reply}"})
    except Exception as e:
        print("OpenAI API error:", e)
        return jsonify(
            {'response': "☕ Sorry! The café is out of beans today (quota exceeded). Please check back later. 💛"})


if __name__ == '__main__':
    app.run(debug=True)
