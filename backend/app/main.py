import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .api import health, auth, complaints, admin
from .seed import create_demo_admin


app = FastAPI(
    title="CampusMind AI Backend",
    version="0.1.0",
    description="Campus complaint management and AI analysis API",
)

frontend_origin = os.getenv(
    "FRONTEND_ORIGIN",
    "http://localhost:5173",
)

allowed_origins = list({
    frontend_origin,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
})
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)
    create_demo_admin()


app.include_router(health.router, tags=["Health"])
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(
    complaints.router,
    prefix="/api/complaints",
    tags=["Student Complaints"],
)
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
