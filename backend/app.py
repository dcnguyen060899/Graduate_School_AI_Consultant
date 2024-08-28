from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import os
from chatservice import ChatService

import time

load_dotenv()
app = Flask(__name__, static_folder='../../docs', static_url_path='/')
CORS(app)  # Initialize CORS with the Flask app



api_key = os.getenv("OPENAI_API_KEY")
chat_service = ChatService(api_key=api_key)

# put questions and answers here
base_qa = {
    "What are the general admission requirements for graduate programs?": "Graduate programs generally require a completed application form, transcripts from all post-secondary institutions attended, letters of recommendation, a statement of purpose, a resume or CV, and standardized test scores (e.g., GRE, GMAT). Some programs may also require a portfolio or writing sample.",
    
    "Do I need to take the GRE for admission?": "The GRE is required for many graduate programs, but some programs may waive this requirement based on professional experience, academic achievements, or completion of a relevant degree. It's best to check the specific requirements of the program you're interested in.",
    
    "What is the minimum GPA requirement for admission?": "Most graduate programs require a minimum GPA of 3.0 on a 4.0 scale, although competitive programs may require higher. The GPA requirement can vary by program and institution, so it's important to check the specific program requirements.",
    
    "How many letters of recommendation are required?": "Most graduate programs require 2-3 letters of recommendation. These letters should typically come from professors or professionals who can speak to your academic abilities, professional experience, and potential for success in graduate studies.",
    
    "What should I include in my statement of purpose?": "Your statement of purpose should outline your academic and professional background, your reasons for pursuing the specific graduate program, your career goals, and how the program aligns with your interests. Highlight any relevant research or professional experience, and be sure to articulate why you are a good fit for the program.",
    
    "Do I need to submit English language proficiency scores?": "As an international student who graduated from a Canadian university where your degree was delivered in English, most programs will waive the English language proficiency requirement. However, you should verify this with each program to ensure they accept your Canadian degree as proof of English proficiency.",
    
    "What is the application deadline for the program?": "Application deadlines vary by program and institution. Fall admission deadlines are typically between December and February, while spring admission deadlines can range from August to October. It's important to check the specific deadlines for each program you are interested in.",
    
    "What is the expected duration of the graduate program?": "The duration of a graduate program typically ranges from 1 to 2 years for a master's degree, depending on whether you are studying full-time or part-time. Some programs, particularly those that are research-intensive or include internships, may take longer.",
    
    "What funding opportunities are available for graduate students?": "Graduate students may have access to various funding opportunities, including scholarships, fellowships, teaching assistantships, research assistantships, and grants. Some programs also offer need-based financial aid. It's recommended to apply for funding early and explore all available options.",
    
    "Can I work while studying in the graduate program?": "International students on a study visa may be allowed to work part-time during their studies, typically up to 20 hours per week. On-campus employment is usually permitted, and some programs may offer paid internships or assistantships. It's important to review visa regulations and program policies regarding work opportunities."
}


@app.route("/")
def index():
    return send_from_directory(app.static_folder, 'index.html')
    
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data["message"]

    if user_message in base_qa:
        time.sleep(3)
        return jsonify({"response": base_qa[user_message]})

    response_content = chat_service.get_response(user_message)
    return jsonify({"response": response_content})


@app.route("/api-check", methods=["GET"])
def api_check():
    try:
        # This is a simplified check. Consider a more specific test for API connectivity if necessary.
        response = chat_service.get_response("Hello")
        if response:
            return jsonify(
                {"status": "success", "message": "API connection is working."}
            )
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})


if __name__ == "__main__":
    app.run(debug=True)
