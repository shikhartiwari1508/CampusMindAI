import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

from backend.app.main import app
from backend.app.database import Base, get_db


test_engine = create_engine(
    "sqlite://",
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

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=test_engine)


def register_and_login(client, email):
    client.post(
        "/api/auth/register",
        json={
            "email": email,
            "password": "StrongPass123",
            "full_name": "Test Student",
        },
    )

    response = client.post(
        "/api/auth/login",
        data={
            "username": email,
            "password": "StrongPass123",
        },
    )

    assert response.status_code == 200
    return {
        "Authorization": f"Bearer {response.json()['access_token']}"
    }


def create_test_complaint(client, headers, title="Water leakage", description="Water leaking near classroom"):
    return client.post(
        "/api/complaints/",
        headers=headers,
        json={
            "title": title,
            "description": description,
            "building": "Academic Block A",
            "location_details": "Ground Floor",
            "category": "Maintenance",
        },
    )


def test_student_can_create_complaint(client):
    headers = register_and_login(client, "student1@example.com")

    response = create_test_complaint(client, headers)

    assert response.status_code == 201
    assert response.json()["title"] == "Water leakage"
    assert response.json()["status"] == "OPEN"


def test_complaint_has_ticket_id_and_ai_analysis(client):
    headers = register_and_login(client, "student2@example.com")

    response = create_test_complaint(client, headers)
    data = response.json()

    assert response.status_code == 201
    assert data["public_ticket_id"]
    assert data["severity"] is not None
    assert data["urgency"] is not None
    assert data["ai_summary"] is not None
    assert data["priority_score"] is not None


def test_student_can_list_own_complaints(client):
    headers = register_and_login(client, "student3@example.com")

    create_test_complaint(client, headers)

    response = client.get("/api/complaints/", headers=headers)

    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["title"] == "Water leakage"


def test_complaint_creation_adds_history(client):
    headers = register_and_login(client, "student4@example.com")

    complaint_response = create_test_complaint(client, headers)
    complaint_id = complaint_response.json()["id"]

    response = client.get(
        f"/api/complaints/{complaint_id}/history",
        headers=headers,
    )

    assert response.status_code == 200
    assert any(item["action"] == "created" for item in response.json())


def test_student_cannot_access_another_students_complaint(client):
    student1_headers = register_and_login(client, "owner@example.com")
    student2_headers = register_and_login(client, "other@example.com")

    complaint_response = create_test_complaint(client, student1_headers)
    complaint_id = complaint_response.json()["id"]

    response = client.get(
        f"/api/complaints/{complaint_id}",
        headers=student2_headers,
    )

    assert response.status_code == 403


def test_nonexistent_complaint_returns_404(client):
    headers = register_and_login(client, "student5@example.com")

    response = client.get(
        "/api/complaints/99999",
        headers=headers,
    )

    assert response.status_code == 404


def test_duplicate_detection_endpoint(client):
    headers = register_and_login(client, "student6@example.com")

    first = create_test_complaint(
        client,
        headers,
        "Water leakage in classroom",
        "Water is leaking near the classroom ceiling",
    )

    assert first.status_code == 201

    second = create_test_complaint(
        client,
        headers,
        "Water leakage in classroom",
        "Water is leaking near the classroom ceiling",
    )

    assert second.status_code == 201

    complaint_id = second.json()["id"]

    response = client.get(
        f"/api/complaints/{complaint_id}/duplicates",
        headers=headers,
    )

    assert response.status_code == 200
    assert len(response.json()) >= 1

def test_student_cannot_access_another_students_complaint_history(client):
    student1 = register_and_login(client, "student1_history@example.com")
    student2 = register_and_login(client, "student2_history@example.com")

    complaint = client.post(
        "/api/complaints/",
        json={
            "title": "Broken classroom light",
            "description": "The classroom light is not working",
            "building": "Academic Block A",
            "location_details": "Room 102",
            "category": "Maintenance"
        },
        headers=student1
    ).json()

    response = client.get(
        f"/api/complaints/{complaint['id']}/history",
        headers=student2
    )

    assert response.status_code == 403


def test_student_cannot_access_another_students_duplicates(client):
    student1 = register_and_login(client, "student1_duplicate@example.com")
    student2 = register_and_login(client, "student2_duplicate@example.com")

    complaint = client.post(
        "/api/complaints/",
        json={
            "title": "Broken classroom light",
            "description": "The classroom light is not working",
            "building": "Academic Block A",
            "location_details": "Room 102",
            "category": "Maintenance"
        },
        headers=student1
    ).json()

    response = client.get(
        f"/api/complaints/{complaint['id']}/duplicates",
        headers=student2
    )

    assert response.status_code == 403


def test_student_cannot_access_another_students_complaint_history(client):
    student1 = register_and_login(client, "student1_history@example.com")
    student2 = register_and_login(client, "student2_history@example.com")

    complaint = create_test_complaint(client, student1).json()

    response = client.get(
        f"/api/complaints/{complaint['id']}/history",
        headers=student2,
    )

    assert response.status_code == 403


def test_student_cannot_access_another_students_duplicates(client):
    student1 = register_and_login(client, "student1_duplicate@example.com")
    student2 = register_and_login(client, "student2_duplicate@example.com")

    complaint = create_test_complaint(client, student1).json()

    response = client.get(
        f"/api/complaints/{complaint['id']}/duplicates",
        headers=student2,
    )

    assert response.status_code == 403


def test_student_cannot_access_nonexistent_complaint_history(client):
    student = register_and_login(client, "student_history404@example.com")

    response = client.get(
        "/api/complaints/999999/history",
        headers=student,
    )

    assert response.status_code == 404

