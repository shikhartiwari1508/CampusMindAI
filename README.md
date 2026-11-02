<div align="center">

# 🎓 CampusMindAI

### Your Voice. Our Intelligence. A Smarter Campus.

**An AI-powered campus complaint management platform that helps students raise issues, track resolutions, and enables administrators to manage campus concerns intelligently.**

<p>
  <a href="https://campusmindai-iota.vercel.app/"><strong>🌐 Live Demo</strong></a>
  &nbsp;•&nbsp;
  <a href="https://github.com/shikhartiwari1508/CampusMindAI"><strong>📂 GitHub Repository</strong></a>
  &nbsp;•&nbsp;
  <a href="http://127.0.0.1:8000/docs"><strong>📘 API Docs (Local)</strong></a>
</p>

![Python](https://img.shields.io/badge/Python-3.x-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=20232A)
![Vite](https://img.shields.io/badge/Vite-Build_Tool-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

![GitHub repo size](https://img.shields.io/github/repo-size/shikhartiwari1508/CampusMindAI?style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/shikhartiwari1508/CampusMindAI?style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/shikhartiwari1508/CampusMindAI?style=flat-square)
![GitHub stars](https://img.shields.io/github/stars/shikhartiwari1508/CampusMindAI?style=flat-square)

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Why CampusMindAI?](#-why-campusmindai)
- [Features](#-features)
- [Application Preview](#-application-preview)
- [How It Works](#-how-it-works)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Running Tests](#-running-tests)
- [Security](#-security)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [Developer](#-developer)
- [License](#-license)

---

## 💡 Overview

CampusMindAI is a smart campus complaint management system built to make communication between students and college administration more organized, transparent, and efficient.

In many institutions, students face difficulty reporting problems, following up on complaints, and knowing whether an issue is being addressed. Administrators, meanwhile, may have to manage scattered reports and repeated complaints manually.

CampusMindAI brings this process into one centralized web platform. Students can submit and track complaints, while administrators can review issues, update their status, record resolution notes, and monitor complaint trends. AI-assisted complaint analysis and duplicate detection help make complaint handling more organized.

> **Our vision:** Every campus concern deserves visibility, attention, and a clear path toward resolution.

## 🌐 Live Demo

<div align="center">

### [🚀 Open CampusMindAI](https://campusmindai-iota.vercel.app/)

Explore the deployed application:

**https://campusmindai-iota.vercel.app/**

</div>

---

## 🎯 Why CampusMindAI?

| Common campus challenge | CampusMindAI approach |
|---|---|
| Complaints are scattered across channels | One centralized complaint platform |
| Students cannot easily follow progress | Complaint status and history tracking |
| Similar issues may be submitted repeatedly | AI-assisted duplicate complaint detection |
| Important issues can be difficult to prioritize | AI-assisted analysis and priority identification |
| Administrators lack a consolidated overview | Dashboard and complaint analytics |
| Students are unsure about resolution progress | Status updates and resolution notes |

## ✨ Features

### 🤖 AI-Assisted Complaint Intelligence
- Analyzes complaint descriptions to support more structured handling.
- Helps identify complaint categories and priority.
- Detects potentially similar or duplicate complaints.
- Designed to support smarter administrative review.

### 🎓 Student Portal
- Student registration and secure login.
- Submit campus complaints through a digital interface.
- View submitted complaints and their current status.
- Track complaint progress and history.
- Follow updates made by the administration.

### 🛡️ Admin Dashboard
- Centralized view of submitted complaints.
- Review and manage complaint records.
- Update complaint status: **Open**, **In Progress**, and **Resolved**.
- Add resolution notes.
- Review complaint activity and status history.
- Monitor complaint statistics through dashboard analytics.

### 📊 Dashboard & Analytics
- Visual overview of complaint records.
- Status-based complaint insights.
- Charts to help administrators understand complaint trends.
- Centralized information for more informed decisions.

### 🔐 Authentication & Access Control
- JWT-based authentication.
- Password hashing.
- Protected API endpoints.
- Role-based access for student and administrator workflows.

---

## 🖥️ Application Preview

> Add your actual application screenshots to `docs/images/` using the filenames below. The image slots are prepared for the project; replace them with screenshots from the deployed application.

### Student Dashboard

![CampusMindAI Student Dashboard](docs/images/student-dashboard.png)

### Admin Dashboard

![CampusMindAI Admin Dashboard](docs/images/admin-dashboard.png)

### Complaint Submission & Tracking

![CampusMindAI Complaint Submission](docs/images/complaint-submission.png)

### Demo Walkthrough

Add a short screen recording or optimized GIF at `docs/images/campusmindai-demo.gif`.

![CampusMindAI Demo](docs/images/campusmindai-demo.gif)

---

## 🔄 How It Works

1. **Register / Login** — A student signs in to the platform.
2. **Submit a Complaint** — The student describes a campus issue and submits it.
3. **AI-Assisted Analysis** — The backend analyzes complaint information and supports categorization and priority assessment.
4. **Duplicate Check** — The system checks whether a similar complaint may already exist.
5. **Admin Review** — An administrator reviews the complaint in the admin dashboard.
6. **Status Update** — The administrator updates its progress and can add resolution notes.
7. **Track Progress** — The student can revisit the complaint and follow its status.
8. **Analyze Trends** — Administrators use dashboard insights to understand reported issues.

---

## 🏗️ System Architecture

```text
                         CAMPUSMINDAI
                               |
                 +-------------+-------------+
                 |                           |
           STUDENT PORTAL                ADMIN PORTAL
                 |                           |
                 +-------------+-------------+
                               |
                        REACT FRONTEND
                               |
                         HTTP / REST API
                               |
                        FASTAPI BACKEND
                               |
          +--------------------+--------------------+
          |                    |                    |
    AUTHENTICATION       COMPLAINT SERVICE      AI SERVICES
          |                    |                    |
       JWT /                Complaint          AI Analysis
    Password Hashing        Management         Duplicate Check
          |                    |                    |
          +--------------------+--------------------+
                               |
                         SQLALCHEMY ORM
                               |
                            SQLITE
                               |
                    DASHBOARD & ANALYTICS
```

### Main Backend Modules

- **API routes:** Authentication, complaint operations, and health endpoints.
- **Services:** AI-assisted analysis and duplicate complaint detection.
- **Database layer:** SQLAlchemy models and database operations.
- **Utilities:** Shared security and helper functions.
- **Schemas:** Request validation and response serialization.

---

## 🧰 Technology Stack

| Layer | Technologies | Purpose |
|---|---|---|
| Frontend | React.js | Interactive user interface |
| Build Tool | Vite | Frontend development and build |
| Styling | Tailwind CSS | Responsive UI styling |
| Charts | Recharts | Dashboard visualizations |
| Icons | Lucide React | Interface icons |
| Backend | Python, FastAPI | REST API and application logic |
| Validation | Pydantic | Data validation and schemas |
| ORM | SQLAlchemy | Database interaction |
| Database | SQLite | Persistent application data |
| Authentication | JWT, password hashing | Secure login and protected routes |
| AI Services | AI analysis integration | Complaint analysis support |
| Version Control | Git, GitHub | Source control and collaboration |
| Deployment | Vercel | Frontend deployment |

---

## 📁 Project Structure

```text
CampusMindAI/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth.py
│   │   │   ├── complaints.py
│   │   │   ├── admin.py
│   │   │   └── health.py
│   │   │
│   │   ├── services/
│   │   │   ├── ai.py
│   │   │   └── duplicate.py
│   │   │
│   │   ├── utils/
│   │   │   └── security.py
│   │   │
│   │   ├── database.py
│   │   ├── dependencies.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── seed.py
│   │
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── context/
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── docs/
│   └── images/
│       ├── student-dashboard.png
│       ├── admin-dashboard.png
│       ├── complaint-submission.png
│       └── campusmindai-demo.gif
│
└── README.md
```

*Note: The `docs/images/` directory is a suggested location for README screenshots and the demo GIF. Add these assets to the repository to display them.*

---

## ⚙️ Getting Started

Follow the steps below to run CampusMindAI on your local machine.

### Prerequisites

Install the following before starting:

- Python 3.10 or later
- Node.js and npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/shikhartiwari1508/CampusMindAI.git
cd CampusMindAI
```

### 2. Set Up the Backend

Create a virtual environment:

```powershell
python -m venv .venv
```

Activate it in Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install backend dependencies:

```powershell
pip install -r backend/requirements.txt
```

Start the FastAPI backend from the project root:

```powershell
python -m uvicorn backend.app.main:app --reload --port 8000
```

The backend will be available at:

```text
http://127.0.0.1:8000
```

### 3. Set Up the Frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Vite will display the local frontend URL in the terminal. Usually:

```text
http://localhost:5173
```

### 4. Open the Application

Visit the frontend URL in your browser. Keep both the backend and frontend development servers running while using the local application.

> **Configuration note:** If your local setup requires environment variables or API credentials, configure them using the variable names expected by the project. Never commit secret keys, passwords, tokens, or production credentials to GitHub.

---

## 📘 API Documentation

CampusMindAI uses FastAPI to expose backend REST endpoints.

When the backend is running, open the interactive Swagger documentation:

**http://127.0.0.1:8000/docs**

Alternative ReDoc documentation:

**http://127.0.0.1:8000/redoc**

---

## 🧪 Running Tests

Run the backend test suite from the project root with the virtual environment activated:

```powershell
python -m pytest backend/app -v
```

The test suite can be used to verify backend functionality during development.

---

## 🔒 Security

Security is an important part of CampusMindAI.

- Passwords are hashed instead of being stored as plain text.
- JWT authentication is used for protected access.
- API routes apply authentication and role checks where required.
- Input data is validated through Pydantic schemas.
- Sensitive credentials should be stored in environment variables and excluded from version control.

---

## 🛣️ Roadmap

Potential enhancements for future versions:

- [ ] Advanced LLM-powered complaint understanding.
- [ ] Hindi and English multilingual experience.
- [ ] AI-generated resolution suggestions.
- [ ] Email and messaging notifications.
- [ ] Mobile application for students.
- [ ] Voice-based complaint submission.
- [ ] Predictive analytics for recurring campus issues.
- [ ] More detailed administrative reports and exports.

---

## 🤝 Contributing

Contributions, ideas, and feedback are welcome!

1. Fork this repository.
2. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Commit your changes:

   ```bash
   git commit -m "Add: your feature description"
   ```

4. Push your branch:

   ```bash
   git push origin feature/your-feature-name
   ```

5. Open a Pull Request.

Please keep contributions focused, documented, and easy to review.

---

## 👨‍💻 Developer

<div align="center">

### Mr. Shikhar Tiwari

**AI & Full-Stack Development Enthusiast**

[![GitHub](https://img.shields.io/badge/GitHub-shikhartiwari1508-181717?style=for-the-badge&logo=github)](https://github.com/shikhartiwari1508)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/shikhar-tiwari-222007372)

**Project:** CampusMindAI  
**Category:** Artificial Intelligence • EdTech • Web Development

</div>

---

## 📄 License

This repository is currently shared for educational, learning, and hackathon purposes. Unless a separate license file is added, all rights are reserved by the repository owner. Please contact the owner before redistributing or using the project commercially.

---

<div align="center">

### 💙 CampusMindAI

**Your Voice. Our Intelligence. A Smarter Campus.**

*Making Every Complaint Count! 🚀*

If you find this project interesting, consider giving the repository a ⭐ on GitHub.

[⬆ Back to Top](#-campusmindai)

</div>
