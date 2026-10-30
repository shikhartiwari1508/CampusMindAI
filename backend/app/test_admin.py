import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

from backend.app.main import app
from backend.app.database import Base, get_db
from backend.app import models
from backend.app.utils.security import get_password_hash


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


@pytest.fixture()
def users():
    db = TestingSessionLocal()

    student = models.User(
        email="student@example.com",
        full_name="Test Student",
        hashed_password=get_password_hash("StrongPass123"),
        role="student",
    )

    admin = models.User(
        email="admin@example.com",
        full_name="Test Admin",
        hashed_password=get_password_hash("StrongPass123"),
        role="admin",
    )

    db.add_all([student, admin])
    db.commit()
    db.refresh(student)
    db.refresh(admin)

    student_id = student.id
    admin_id = admin.id
    db.close()

    return {"student_id": student_id, "admin_id": admin_id}


def login(client, email):
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


@pytest.fixture()
def auth_headers(client, users):
    return {
        "student": login(client, "student@example.com"),
        "admin": login(client, "admin@example.com"),
    }


@pytest.fixture()
def complaint(client, auth_headers):
    response = client.post(
        "/api/complaints/",
        headers=auth_headers["student"],
        json={
            "title": "Broken classroom fan",
            "description": "The ceiling fan is not working",
            "building": "Academic Block A",
            "location_details": "Room 101",
            "category": "Maintenance",
        },
    )
    assert response.status_code == 201
    return response.json()


def test_student_cannot_access_admin_dashboard(client, auth_headers):
    response = client.get(
        "/api/admin/dashboard",
        headers=auth_headers["student"],
    )
    assert response.status_code == 403


def test_admin_can_access_dashboard(client, auth_headers):
    response = client.get(
        "/api/admin/dashboard",
        headers=auth_headers["admin"],
    )
    assert response.status_code == 200
    assert isinstance(response.json(), dict)


def test_admin_can_list_all_complaints(client, auth_headers, complaint):
    response = client.get(
        "/api/admin/complaints",
        headers=auth_headers["admin"],
    )
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_admin_can_filter_complaints_by_status(client, auth_headers, complaint):
    response = client.get(
        "/api/admin/complaints?status_filter=OPEN",
        headers=auth_headers["admin"],
    )
    assert response.status_code == 200
    assert len(response.json()) == 1

    invalid = client.get(
        "/api/admin/complaints?status_filter=INVALID",
        headers=auth_headers["admin"],
    )
    assert invalid.status_code == 400


def test_admin_can_update_complaint_status(client, auth_headers, complaint):
    complaint_id = complaint["id"]

    response = client.patch(
        f"/api/admin/{complaint_id}",
        headers=auth_headers["admin"],
        json={"status": "IN_PROGRESS"},
    )

    assert response.status_code == 200
    assert response.json()["status"] == "IN_PROGRESS"


def test_admin_can_resolve_complaint(client, auth_headers, complaint):
    complaint_id = complaint["id"]

    response = client.patch(
        f"/api/admin/{complaint_id}",
        headers=auth_headers["admin"],
        json={
            "status": "RESOLVED",
            "resolution_note": "Fan repaired successfully",
        },
    )

    assert response.status_code == 200
    assert response.json()["status"] == "RESOLVED"
    assert response.json()["resolved_at"] is not None
    assert response.json()["resolution_note"] == "Fan repaired successfully"


def test_admin_can_add_note(client, auth_headers, complaint):
    complaint_id = complaint["id"]

    response = client.post(
        f"/api/admin/{complaint_id}/notes",
        headers=auth_headers["admin"],
        json={"note": "Technician assigned"},
    )

    assert response.status_code == 200
    assert response.json()["detail"] == "Note added"


def test_admin_can_access_analytics(client, auth_headers):
    response = client.get(
        "/api/admin/analytics",
        headers=auth_headers["admin"],
    )

    assert response.status_code == 200
    assert isinstance(response.json(), dict)

def test_student_cannot_add_admin_note(client, auth_headers, complaint):
    response = client.post(
        f"/api/admin/{complaint['id']}/notes",
        json={"note": "Unauthorized note"},
        headers=auth_headers["student"],
    )
    assert response.status_code == 403


def test_admin_cannot_update_nonexistent_complaint(client, auth_headers):
    response = client.patch(
        "/api/admin/999999",
        json={"status": "RESOLVED"},
        headers=auth_headers["admin"],
    )
    assert response.status_code == 404


def test_admin_cannot_add_empty_note(client, auth_headers, complaint):
    response = client.post(
        f"/api/admin/{complaint['id']}/notes",
        json={"note": "   "},
        headers=auth_headers["admin"],
    )
    assert response.status_code == 422


def test_admin_cannot_update_invalid_complaint_status(client, auth_headers, complaint):
    response = client.patch(
        f"/api/admin/{complaint['id']}",
        json={"status": "INVALID_STATUS"},
        headers=auth_headers["admin"],
    )

    assert response.status_code == 422

