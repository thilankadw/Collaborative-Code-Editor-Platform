import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from phi.agent import Agent
from phi.model.openai import OpenAIChat
from pydantic import BaseModel
from typing import List, Optional
from flask_cors import CORS
load_dotenv()

app = Flask(__name__)

CORS(app)

class CodeIssue(BaseModel):
    description: str
    line_number: Optional[int] = None

class CodeAnalysisResult(BaseModel):
    errors: List[CodeIssue]
    code_smells: List[CodeIssue]
    potential_bugs: List[CodeIssue]

code_analyzer = Agent(
    name="CodeAnalyzer",
    model=OpenAIChat(id="gpt-4o-mini"),
    instructions="""
    You are a professional code reviewer. Analyze the given code and identify:
    - Syntax errors
    - Code smells (e.g., duplicated code, long methods, magic numbers)
    - Potential bugs (e.g., off-by-one errors, null pointer dereferences, race conditions)

    Provide each issue with a description and line number if possible.
    Return the results in a structured JSON format as per the CodeAnalysisResult schema.
    """,
    response_model=CodeAnalysisResult
)

@app.route('/analyze', methods=['POST'])
def analyze_code():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "Empty filename"}), 400

    try:
        file_content = file.read().decode('utf-8')
    except Exception as e:
        return jsonify({"error": f"Failed to read file: {str(e)}"}), 400

    try:
        result = code_analyzer.run(file_content)
        data = result.content.model_dump()

        if (
            len(data["errors"]) == 0 and
            len(data["code_smells"]) == 0 and
            len(data["potential_bugs"]) == 0
        ):
            return jsonify({
                "message": "No issues found. The code appears clean and well-structured."
            })

        return jsonify(data)

    except Exception as e:
        return jsonify({"error": f"Analysis failed: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)