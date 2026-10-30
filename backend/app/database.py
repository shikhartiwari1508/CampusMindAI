"""Database configuration for CampusMind AI backend.

- Uses SQLite for local development (default) but respects DATABASE_URL env variable.
- Provides a SQLAlchemy ``engine`` and a session factory ``SessionLocal``.
- ``Base`` is the declarative base for model definitions.
- ``get_db`` yields a session and ensures proper cleanup.
"""

import os
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Load environment variables from .env if present (backend entry point will load dotenv)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./campusmind.db")

# For SQLite, ensure the path is absolute and the directory exists
if DATABASE_URL.startswith("sqlite"):
    # Extract file path after 'sqlite:///'
    db_path = DATABASE_URL.replace("sqlite:///", "")
    # Resolve relative paths relative to the project root (backend directory)
    db_path = Path(__file__).parent.parent / db_path
    db_path.parent.mkdir(parents=True, exist_ok=True)
    DATABASE_URL = f"sqlite:///{db_path}"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
    echo=False,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency for FastAPI routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
