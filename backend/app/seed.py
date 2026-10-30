# Seed script to create a demo admin user if none exists

"""When the FastAPI app starts, this module ensures there is a default
administrator account for local development. The credentials are printed
to the console (only in dev) so you can log in immediately.

The admin email/password are taken from environment variables (falling back
to obvious defaults). This script is safe to run multiple times â€“ it only
creates the user when it does not already exist.
"""

import os
from .database import SessionLocal
from . import models
from .utils import security

DEMO_ADMIN_EMAIL = os.getenv("DEMO_ADMIN_EMAIL", "admin@example.com")
DEMO_ADMIN_PASSWORD = os.getenv("DEMO_ADMIN_PASSWORD", "admin123")


def create_demo_admin():
    db = SessionLocal()
    try:
        existing = db.query(models.User).filter(models.User.email == DEMO_ADMIN_EMAIL).first()
        if existing:
            return  # Admin already present
        admin_user = models.User(
            email=DEMO_ADMIN_EMAIL,
            hashed_password=security.get_password_hash(DEMO_ADMIN_PASSWORD),
            full_name="Demo Administrator",
            role="admin",
        )
        db.add(admin_user)
        db.commit()
        print("\n=== Demo admin credentials ===")
        print(f"Email: {DEMO_ADMIN_EMAIL}")
        print(f"Password: {DEMO_ADMIN_PASSWORD}\n")
    finally:
        db.close()


