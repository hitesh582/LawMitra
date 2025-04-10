from pymongo import MongoClient
from faker import Faker
from datetime import datetime, date, timedelta
import random

# MongoDB connection URI (replace with your actual credentials if needed)
mongo_uri = "mongodb+srv://hitesh21csu389:8d2Ek2vrQq5sjwER@lawmitra10.dnbpt.mongodb.net/test"

# Connect to MongoDB
client = MongoClient(mongo_uri)
db = client['test']  # Adjust your database name if different
collection = db['lawyerverifications']

# Initialize Faker
fake = Faker()

# Define a list of sample specializations
specializations = ["criminal", "corporate", "family", "civil", "intellectualProperty"]

def convert_to_datetime(date_obj):
    """Convert a datetime.date object to datetime.datetime."""
    if isinstance(date_obj, date):
        return datetime.combine(date_obj, datetime.min.time())
    return date_obj

def generate_fake_lawyer(i):
    """
    Generate a fake lawyer record with correct datetime conversion.
    """
    # Generate a random age and a corresponding date of birth, then convert to datetime.datetime
    age = random.randint(25, 65)
    dob_date = fake.date_of_birth(minimum_age=age, maximum_age=age)
    dob = convert_to_datetime(dob_date)

    # Determine graduation year (ensuring at least a 4-year gap before now)
    graduation_year = random.randint(1980, datetime.now().year - 4)
    
    # Generate license issued date: after graduation (assume around summer) until a year before today
    license_issued_date = fake.date_between_dates(
        date_start=datetime(graduation_year, 6, 1),
        date_end=datetime.now() - timedelta(days=365)
    )
    licenseIssued = convert_to_datetime(license_issued_date)
    
    # License expiry: set to a random period (10 to 20 years) after the issued date
    license_expiry_date = license_issued_date + timedelta(days=random.randint(10*365, 20*365))
    licenseExpiry = convert_to_datetime(license_expiry_date)
    
    lawyer = {
        "userId": fake.uuid4(),  # If an ObjectId is needed, you could use ObjectId() from bson instead
        "fullName": fake.name(),
        "dateOfBirth": dob,
        "phone": fake.msisdn()[:10],  # Adjust to simulate a 10-digit phone number
        "email": fake.email(),
        "address": fake.address(),
        "barLicenseNumber": f"BLN{random.randint(1000, 9999)}",
        "stateRegistration": fake.state(),
        "licenseIssued": licenseIssued,
        "licenseExpiry": licenseExpiry,
        "lawFirm": fake.company(),
        "lawSchool": fake.company() + " Law School",
        "graduationYear": graduation_year,
        "experience": random.randint(1, 40),
        "specialization": random.choice(specializations),
        "bio": fake.text(max_nb_chars=200),
        "references": fake.paragraph(nb_sentences=2),
        "documentUrl": fake.image_url(),  # Placeholder URL
        "status": "approved",
        "submittedAt": datetime.now()
    }
    return lawyer

# Generate 600 fake lawyer records
lawyers = [generate_fake_lawyer(i) for i in range(600)]

# Bulk insert the generated records into MongoDB
try:
    result = collection.insert_many(lawyers)
    print(f"Inserted {len(result.inserted_ids)} lawyer records successfully!")
except Exception as e:
    print("An error occurred while inserting data:", e)
