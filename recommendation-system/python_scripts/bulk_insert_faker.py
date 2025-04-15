from pymongo import MongoClient
from faker import Faker
from datetime import datetime, date, timedelta
import random
import os
from dotenv import load_dotenv

load_dotenv()
# MongoDB connection URI (replace with your actual credentials if needed)
mongo_uri = os.getenv("MONGO_URI")

# Connect to MongoDB
client = MongoClient(mongo_uri)
db = client['test']  # Adjust your database name if different
collection = db['lawyerverifications']

# Initialize Faker
fake = Faker()

# Define a list of sample specializations (same as in the form)
specializations = ["criminal", "corporate", "family", "civil", "intellectualProperty"]

def convert_to_datetime(date_obj):
    """Convert a datetime.date object to datetime.datetime."""
    if isinstance(date_obj, date):
        return datetime.combine(date_obj, datetime.min.time())
    return date_obj

def generate_fake_lawyer(i):
    """
    Generate a fake lawyer record ensuring that the data is consistent with the React form validations.
    """
    current_year = datetime.now().year

    # 1. Generate a realistic age and corresponding dateOfBirth.
    # Use ages between 26 and 65 (increasing the minimum age to enable sensible graduation year calculation).
    age = random.randint(26, 65)
    dob_date = fake.date_of_birth(minimum_age=age, maximum_age=age)
    dob = convert_to_datetime(dob_date)
    birth_year = dob.year

    # 2. Determine the graduation year.
    # Define a minimum graduation age offset (e.g., 20 years after birth)
    min_grad_year = max(1980, birth_year + 20)
    # Maximum graduation year is set to one year before the current year to ensure some experience.
    max_grad_year = current_year - 1
    # Ensure the bounds make sense (if the lawyer is very young this could fail, so we rely on age>=26).
    if min_grad_year > max_grad_year:
        graduation_year = max_grad_year
    else:
        graduation_year = random.randint(min_grad_year, max_grad_year)

    # 3. Generate experience.
    # Experience is chosen as a random number between 1 and (current_year - graduation_year).
    # This guarantees that graduationYear <= current_year - experience.
    max_possible_exp = current_year - graduation_year
    if max_possible_exp < 1:
        max_possible_exp = 1
    experience = random.randint(1, max_possible_exp)

    # 4. Generate a 10-digit phone number.
    phone = str(random.randint(10**9, 10**10 - 1))

    # 5. Generate license issued date (must be after graduation)
    # We'll start from June 1st of the graduation year.
    license_start = datetime(graduation_year, 6, 1)
    # License issued date must be at least one year before today.
    license_end = datetime.now() - timedelta(days=365)
    # Adjust license_end if graduation is very recent.
    if license_start > license_end:
        license_end = license_start + timedelta(days=365)
    license_issued_date = fake.date_between_dates(date_start=license_start, date_end=license_end)
    licenseIssued = convert_to_datetime(license_issued_date)
    
    # 6. Generate license expiry date: 10 to 20 years after license issued.
    license_expiry_date = license_issued_date + timedelta(days=random.randint(10*365, 20*365))
    licenseExpiry = convert_to_datetime(license_expiry_date)

    lawyer = {
        "userId": fake.uuid4(),  # Alternatively, use ObjectId() from bson if needed
        "fullName": fake.name(),
        "dateOfBirth": dob,
        "phone": phone,
        "email": fake.email(),
        "address": fake.address(),
        "barLicenseNumber": f"BLN{random.randint(1000, 9999)}",
        "stateRegistration": fake.state(),
        "licenseIssued": licenseIssued,
        "licenseExpiry": licenseExpiry,
        "lawFirm": fake.company(),
        "lawSchool": fake.company() + " Law School",
        "graduationYear": graduation_year,
        "experience": experience,
        "specialization": random.choice(specializations),
        "bio": fake.text(max_nb_chars=200),
        "references": fake.paragraph(nb_sentences=2),
        "documentUrl": fake.image_url(),  # Placeholder URL
        "status": "approved",  # Set status to pending to match form submission logic
        "submittedAtt": datetime.now()
    }
    return lawyer

# Optionally, clear the collection before seeding:
collection.delete_many({})

# Generate 600 fake lawyer records
lawyers = [generate_fake_lawyer(i) for i in range(600)]

# Bulk insert the generated records into MongoDB
try:
    result = collection.insert_many(lawyers)
    print(f"Inserted {len(result.inserted_ids)} lawyer records successfully!")
except Exception as e:
    print("An error occurred while inserting data:", e)
