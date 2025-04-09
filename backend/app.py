
# from flask import Flask, request, jsonify
# import google.generativeai as genai
# from flask_cors import CORS # Add this line


# app = Flask(__name__)
# CORS(app) # Add this line


# # Configure your Gemini Pro API key
# genai.configure(api_key="AIzaSyCNfV_PPNGcUsvb7HCwha65CVqxxj1xGks") # Replace with your actual API key
# model = genai.GenerativeModel('gemini-2.0-flash')

# @app.route('/friendly_chat', methods=['POST'])
# def friendly_chat():
#     try:
#         data = request.get_json()
#         user_message = data['message']

#         # Construct the prompt for Gemini Pro, including instructions for friendly tone and emotion detection
#         prompt = f"""
#         You are a friendly and supportive chatbot designed to talk to users about periods and girl health.
#         Maintain a casual and empathetic tone, like chatting with a friend. 
#         Analyze the user's message for emotional tone. If the user expresses strong emotions
#         (e.g., "noooo wayy", "I'm so happy!"), respond accordingly, and mirror their emotional state.

#         User: {user_message}
#         """

#         response = model.generate_content(prompt)
#         return jsonify({'response': response.text})

#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# if __name__ == '__main__':
#     app.run(debug=True)

from flask import Flask, request, jsonify
import google.generativeai as genai
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Configure your Gemini Pro API key
api_key = os.environ.get("AIzaSyCNfV_PPNGcUsvb7HCwha65CVqxxj1xGks")
if not api_key:
    # Fallback for local testing - REPLACE WITH YOUR ACTUAL KEY TEMPORARILY
    api_key = "AIzaSyCNfV_PPNGcUsvb7HCwha65CVqxxj1xGks"  
    print("Warning: Using hardcoded API key. Use environment variable in production.")
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-2.0-flash')

# Dictionary to store conversation history for each user (using a session ID or similar)
conversation_history = {}

@app.route('/basic_chat', methods=['POST'])
def friendly_chat():
    try:
        data = request.get_json()
        user_message = data['message']
        # In a real application, you would use a unique user identifier (e.g., session ID)
        user_id = "default_user"  #  Replace with actual user ID

        # Get the conversation history for this user, or create a new history if it doesn't exist
        if user_id not in conversation_history:
            conversation_history[user_id] = []

        history = conversation_history[user_id]

        # Add the user's message to the history
        history.append({"role": "user", "parts": [user_message]})

        # Construct the prompt, including the conversation history
        prompt = ""
        for turn in history:
            if turn["role"] == "user":
                prompt += f"User: {turn['parts'][0]}\n"
            else:
                prompt += f"Chatbot: {turn['parts'][0]}\n"
        prompt += f"User: {user_message}\nChatbot: "

        response = model.generate_content(prompt)
        bot_response = response.text

        # Add the chatbot's response to the history
        history.append({"role": "model", "parts": [bot_response]})

        # Limit history length (optional)
        if len(history) > 10:  # Keep only the last 10 turns
            history = history[-10:]
        conversation_history[user_id] = history
        
        return jsonify({'response': bot_response})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
