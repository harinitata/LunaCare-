from flask import Flask, request, jsonify
import google.generativeai as genai

app = Flask(__name__)

# Configure your Gemini Pro API key
genai.configure(api_key="  ") # Replace with your actual API key
model = genai.GenerativeModel('gemini-2.0-flash')

@app.route('/friendly_chat', methods=['POST'])
def friendly_chat():
    try:
        data = request.get_json()
        user_message = data['message']

        # Construct the prompt for Gemini Pro, including instructions for friendly tone and emotion detection
        prompt = f"""
        You are a friendly and supportive chatbot designed to talk to users about periods and girl health.
        Maintain a casual and empathetic tone, like chatting with a friend.
        Analyze the user's message for emotional tone. If the user expresses strong emotions
        (e.g., "noooo wayy", "I'm so happy!"), respond accordingly, and mirror their emotional state.

        User: {user_message}
        """

        response = model.generate_content(prompt)
        return jsonify({'response': response.text})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
