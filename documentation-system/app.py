from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from processor import CourtCaseProcessor
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
processor = CourtCaseProcessor()

@app.route('/process-pdf', methods=['POST'])
def process_pdf():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    text = processor.pdf_to_text(filepath)
    if not text:
        return jsonify({"error": "Failed to extract text"}), 500

    summary = processor.get_summary(text)
    sections = processor.get_sections(text)

    return jsonify({
        "summary": summary,
        "sections": sections
    })

if __name__ == "__main__":
    port = int(os.getenv("FLASK_PORT", 5001))
    app.run(debug=True, port=port)