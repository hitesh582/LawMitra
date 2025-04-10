from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from bson import ObjectId  # Ensure you have pymongo installed (it comes with bson)

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
allowed_origins = ['http://localhost:5173', 'http://localhost:5174']
CORS(app, resources={r"/*": {"origins": allowed_origins}})

# Fetch MongoDB URI and port from environment variables
mongo_uri = os.getenv("MONGO_URI")
flask_port = int(os.getenv("FLASK_PORT", 5000))

# Connect to MongoDB
client = MongoClient(mongo_uri)
db = client['test']  # Replace 'lawdb' with your actual database name if needed
collection = db['lawyerverifications']  # The collection storing lawyer verifications


def convert_objectid(obj):
    """Recursively convert ObjectId instances in a dict or list to strings."""
    if isinstance(obj, list):
        return [convert_objectid(item) for item in obj]
    elif isinstance(obj, dict):
        new_obj = {}
        for k, v in obj.items():
            new_obj[k] = convert_objectid(v)
        return new_obj
    elif isinstance(obj, ObjectId):
        return str(obj)
    else:
        return obj


def get_lawyers_from_db():
    """
    Retrieve approved lawyer verification records from MongoDB.
    """
    lawyers = list(collection.find({"status": "approved"}))
    # Convert any ObjectId in each lawyer document to string
    lawyers = [convert_objectid(lawyer) for lawyer in lawyers]
    return lawyers


def compute_text_similarity(query, lawyers, field_names):
    """
    Build a text corpus using selected fields for each lawyer and calculate
    cosine similarity with the query string.
    """
    corpus = []
    for lawyer in lawyers:
        # Combine text from given fields (e.g., specialization, lawSchool, bio)
        text = " ".join(str(lawyer.get(field, "")) for field in field_names)
        corpus.append(text)
    corpus.append(query)  # Append the user query to the corpus
    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf = vectorizer.fit_transform(corpus)
    query_vec = tfidf[-1]
    lawyer_vecs = tfidf[:-1]
    similarities = cosine_similarity(lawyer_vecs, query_vec)
    return similarities.flatten()

def get_recommendations(filters):
    """
    Generate recommendations by combining data from MongoDB with a scoring model.
    This version gives an explicit bonus if the lawyer's specialization exactly matches
    the filter's specialization, making specialization the top priority.
    """
    lawyers = get_lawyers_from_db()
    if not lawyers:
        return []

    # Build the query text from non-specialization fields for text similarity.
    # We leave out "specialization" because we handle that separately.
    query_text = ""
    if filters.get("lawSchool"):
        query_text += filters["lawSchool"] + " "
    if filters.get("bio"):
        query_text += filters["bio"]

    # Compute text similarity using selected fields (excluding specialization)
    # If you still want to consider specialization text similarity, you can include it,
    # but note that we also add an explicit bonus below.
    text_similarities = compute_text_similarity(query_text, lawyers, ["lawSchool", "bio"])

    recommendations = []
    for idx, lawyer in enumerate(lawyers):
        score = 0

        # Give a high priority bonus for exact specialization match.
        # This bonus helps ensure a civil lawyer is ranked higher when 'civil' is requested.
        if filters.get("specialization"):
            if lawyer.get("specialization", "").strip().lower() == filters["specialization"].strip().lower():
                score += 5  # Increase this bonus as needed

        # Now factor in text similarity on other fields.
        score += text_similarities[idx] * 3

        # Apply numeric filters for experience.
        try:
            exp = lawyer.get("experience", 0)
            if filters.get("minExperience"):
                if exp >= float(filters["minExperience"]):
                    score += 1
            if filters.get("maxExperience"):
                if exp <= float(filters["maxExperience"]):
                    score += 1
        except ValueError:
            pass

        # Bonus for an exact match on graduation year.
        if filters.get("graduationYear"):
            try:
                if lawyer.get("graduationYear") == int(filters["graduationYear"]):
                    score += 1
            except ValueError:
                pass

        recommendations.append((lawyer, score))

    # Sort recommendations by score, highest first, and return the top 5 (or top 3 if preferred)
    recommendations.sort(key=lambda x: x[1], reverse=True)
    return [rec[0] for rec in recommendations[:3]]

@app.route('/recommend', methods=['POST'])
@cross_origin(origins=allowed_origins)
def recommend():
    try:
        filters = request.get_json()
        recommended_lawyers = get_recommendations(filters)
        # Recursively convert any ObjectId in the recommendations
        recommended_lawyers = [convert_objectid(lawyer) for lawyer in recommended_lawyers]
        return jsonify({"success": True, "recommendations": recommended_lawyers})
    except Exception as e:
        print("Error occurred:", e)
        return jsonify({"success": False, "error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=flask_port)
