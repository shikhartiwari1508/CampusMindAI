import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

from backend.app.main import app
from backend.app.database import Base, get_db


# Temporary in-memory SQLite database for tests
TEST_DATABASE_URL = "sqlite://"

test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=test_engine,
)


@pytest.fixture()
def client():
    Base.metadata.create_all(bind=test_engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    # Prevent startup from initializing the original database
    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=test_engine)


def test_health_endpoint(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_student_registration(client):
    response = client.post(
        "/api/auth/register",
        json={
            "email": "student@example.com",
            "password": "StrongPass123",
            "full_name": "Test Student",
        },
    )

    assert response.status_code == 200
    assert response.json()["email"] == "student@example.com"
    assert response.json()["role"] == "student"


def test_duplicate_email_registration(client):
    user = {
        "email": "duplicate@example.com",
        "password": "StrongPass123",
        "full_name": "Test Student",
    }

    first_response = client.post("/api/auth/register", json=user)
    second_response = client.post("/api/auth/register", json=user)

    assert first_response.status_code == 200
    assert second_response.status_code == 400


def test_login_returns_access_token(client):
    client.post(
        "/api/auth/register",
        json={
            "email": "login@example.com",
            "password": "StrongPass123",
            "full_name": "Login Student",
        },
    )

    response = client.post(
        "/api/auth/login",
        data={
            "username": "login@example.com",
            "password": "StrongPass123",
        },
    )

    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"


def test_authenticated_user_profile(client):
    client.post(
        "/api/auth/register",
        json={
            "email": "profile@example.com",
            "password": "StrongPass123",
            "full_name": "Profile Student",
        },
    )

    login_response = client.post(
        "/api/auth/login",
        data={
            "username": "profile@example.com",
            "password": "StrongPass123",
        },
    )

    token = login_response.json()["access_token"]

    response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200
    assert response.json()["email"] == "profile@example.com"
    assert response.json()["full_name"] == "Profile Student"
    assert response.json()["role"] == "student"

def test_login_rejects_wrong_password(client):
    client.post(
        "/api/auth/register",
        json={
            "email": "wrongpass@example.com",
            "full_name": "Wrong Password User",
            "password": "StrongPass123"
        }
    )

    response = client.post(
        "/api/auth/login",
        data={
            "username": "wrongpass@example.com",
            "password": "WrongPassword123"
        }
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"


def test_login_rejects_unknown_email(client):
    response = client.post(
        "/api/auth/login",
        data={
            "username": "unknown@example.com",
            "password": "StrongPass123"
        }
    )

    assert response.status_code == 401


def test_invalid_jwt_token_is_rejected(client):
    response = client.get(
        "/api/auth/me",
        headers={"Authorization": "Bearer invalid.jwt.token"}
    )

    assert response.status_code == 401

