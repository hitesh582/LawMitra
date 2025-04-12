import os
from pdf2image import convert_from_path
import pytesseract
from transformers import pipeline
import spacy
from pathlib import Path
import torch


class CourtCaseProcessor:
    def __init__(self):
        # Set device for transformers
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"Using device: {self.device}")

        if self.device == "cuda":
            torch.cuda.set_device(0)
            print(f"GPU in use: {torch.cuda.get_device_name(0)}")

        # Load models
        self.summarizer = pipeline(
            "summarization",
            model="sshleifer/distilbart-cnn-12-6",
            device=0 if self.device == "cuda" else -1
        )
        self.nlp = spacy.load("en_core_web_sm")

    def pdf_to_text(self, pdf_path):
        """Convert a PDF file to text using OCR."""
        try:
            print(f"Converting {pdf_path} to text...")
            # Make sure to specify the correct poppler_path directory
            images = convert_from_path(
                pdf_path,
                poppler_path=r"C:\Users\HITESH KUMAR\Downloads\poppler-24.08.0\Library\bin"
            )
            print(f"Converted to {len(images)} pages.")

            full_text = ""
            for i, image in enumerate(images):
                print(f"OCR on page {i+1}")
                page_text = pytesseract.image_to_string(image)
                full_text += page_text + "\n"

            return full_text
        except Exception as e:
            print(f"Error in pdf_to_text: {e}")
            return None

    def get_sections(self, text):
        """Identify legal sections and acts from the text."""
        doc = self.nlp(text)
        sections = set()

        acts = {
            'IPC': 'Indian Penal Code',
            'CrPC': 'Code of Criminal Procedure',
            'CPC': 'Code of Civil Procedure',
            'IT Act': 'Information Technology Act',
            'Consumer Protection Act': 'Consumer Protection Act',
            'NDPS': 'Narcotic Drugs and Psychotropic Substances Act',
            'Prevention of Corruption Act': 'Prevention of Corruption Act'
        }

        for i, token in enumerate(doc):
            if token.text.lower() in ['section', 's.', 'sec.', 'ss.', 'sections']:
                next_tokens = doc[i + 1:i + 10].text
                section_num = ''
                act_name = ''

                # Extract section number
                words = next_tokens.split()
                if words:
                    for char in words[0]:
                        if char.isdigit() or char in '-,':
                            section_num += char

                # Match known acts
                for key, full_name in acts.items():
                    if key in next_tokens:
                        act_name = full_name
                        break

                if section_num:
                    if act_name:
                        sections.add(f"Section {section_num} of the {act_name}")
                    else:
                        sections.add(f"Section {section_num}")

        return ', '.join(sections) if sections else 'No sections found'

    def get_summary(self, text):
        """Generate a custom summary based on subject and context."""
        try:
            text = text.replace('\n', ' ').strip()
            case_subjects = {
                'murder': ['murder', 'killed', 'death', 'homicide', '302 IPC', 'deceased'],
                'property dispute': ['property', 'land', 'possession', 'title', 'ownership', 'tenant'],
                'corruption': ['corruption', 'bribe', 'misappropriation', 'prevention of corruption act'],
                'theft': ['theft', 'stolen', 'robbery', 'burglary', '379 IPC'],
                'assault': ['assault', 'attack', 'hurt', 'injury', 'grievous', '324 IPC', '325 IPC'],
                'fraud': ['fraud', 'cheating', 'misrepresentation', 'forgery', '420 IPC'],
                'rape': ['rape', 'sexual assault', '376 IPC'],
                'dowry': ['dowry', 'dowry death', '304B IPC'],
                'drugs': ['drugs', 'NDPS', 'narcotic', 'possession of drugs'],
                'domestic violence': ['domestic violence', 'cruelty', '498A IPC'],
                'cybercrime': ['cyber', 'computer', 'online', 'IT Act'],
                'defamation': ['defamation', 'defame', '499 IPC', '500 IPC'],
                'kidnapping': ['kidnapping', 'abduction', '363 IPC'],
                'accident': ['accident', 'negligence', 'motor vehicle', 'compensation']
            }

            text_lower = text.lower()
            case_subject = None
            max_matches = 0

            for subject, keywords in case_subjects.items():
                matches = sum(1 for keyword in keywords if keyword in text_lower)
                if matches > max_matches:
                    max_matches = matches
                    case_subject = subject

            doc = self.nlp(text)
            relevant_sentences = []

            fact_indicators = ['facts', 'brief facts', 'prosecution case', 'allegations', 'according to']
            for sent in doc.sents:
                sent_text = sent.text.lower()
                if any(ind in sent_text for ind in fact_indicators):
                    if len(sent_text.split()) > 5:
                        relevant_sentences.append(sent.text)
                        if len(relevant_sentences) >= 2:
                            break

            if not relevant_sentences and case_subject:
                for sent in doc.sents:
                    sent_text = sent.text.lower()
                    if any(keyword in sent_text for keyword in case_subjects[case_subject]):
                        if len(sent_text.split()) > 5:
                            relevant_sentences.append(sent.text)
                            if len(relevant_sentences) >= 2:
                                break

            summary_parts = []
            if case_subject:
                summary_parts.append(f"This is a case regarding {case_subject}.")
            if relevant_sentences:
                summary_parts.append(" ".join(relevant_sentences))

            return " ".join(summary_parts) if summary_parts else "No specific summary could be generated."
        except Exception as e:
            print(f"Error generating summary: {e}")
            return "Error generating summary"
