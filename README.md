# 🎓 CampusMindAI — Smart Campus Complaint Management System

<p align="center">

  **An AI-Powered Platform for a Smarter, Faster & Better Campus**

  Transforming campus complaint management through Artificial Intelligence, Automation and Real-Time Analytics.

  [🌐 Live Demo](https://campusmindai-iota.vercel.app/)

</p>

---

## 🚀 About CampusMindAI

**CampusMindAI** is an intelligent, AI-powered campus complaint management platform designed to simplify communication between students and college administration.

Traditional complaint systems often involve paperwork, delayed responses, poor tracking and inefficient complaint handling. CampusMindAI addresses these challenges through an intelligent digital platform that automates complaint analysis, detects duplicate complaints, assigns priorities and provides transparent complaint tracking.

The platform enables students to submit and monitor complaints while administrators can efficiently manage, analyze and resolve campus issues through a centralized dashboard.

**Our Mission:** To build a smarter, more transparent and responsive campus environment where every student's voice matters.

---

## ✨ Key Features

### 🤖 AI-Powered Intelligence
- **AI Complaint Analysis:** Automatically analyzes submitted complaints.
- **Smart Classification:** Helps categorize campus-related issues.
- **Priority Detection:** Identifies complaint priority for better management.
- **Duplicate Detection:** Detects similar complaints to reduce repetition and improve efficiency.

### 👨‍🎓 Student Dashboard
- Student registration and secure login.
- Submit new campus complaints.
- Track complaint status in real time.
- View complaint history.
- Receive status update notifications.
- Monitor complaint progress.

### 🛡️ Admin Dashboard
- Centralized complaint management.
- View and manage student complaints.
- Update complaint status: Open, In Progress and Resolved.
- Add resolution notes.
- Monitor complaint statistics.
- Analyze campus issues through interactive charts.
- View complaint history and status updates.

### 📊 Smart Analytics
- Interactive dashboard visualizations.
- Complaint statistics and trends.
- Status-based analytics.
- Backend-powered dashboard data.
- Better insights for administrative decision-making.

### 🔐 Security & Authentication
- JWT-based authentication.
- Secure password hashing.
- Role-based access for students and administrators.
- Protected API endpoints.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Python | Backend Development |
| FastAPI | REST API Framework |
| SQLAlchemy | Database ORM |
| SQLite | Database |
| Pydantic | Data Validation |
| JWT | Authentication |
| React.js | Frontend Development |
| Vite | Frontend Build Tool |
| Tailwind CSS | UI Styling |
| Recharts | Data Visualization |
| Lucide React | Icons |

---

## 🏗️ System Architecture

```text
                 CAMPUSMINDAI
                       |
          +------------+------------+
          |                         |
     STUDENT PORTAL            ADMIN PORTAL
          |                         |
          +------------+------------+
                       |
                REACT FRONTEND
                       |
                  REST APIs
                       |
                FASTAPI BACKEND
                       |
          +------------+------------+
          |            |            |
      AUTHENTICATION  AI ENGINE  COMPLAINT
                                  MANAGEMENT
                       |
              DUPLICATE DETECTION
                       |
                 SQLALCHEMY
                       |
                  SQLITE DB
                       |
              ANALYTICS & REPORTS
```

---

## 📂 Project Structure

```text
CampusMindAI/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── database.py
│   │   ├── dependencies.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── campusmind.db
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md
```

---

## ⚙️ Installation & Setup

Follow these steps to run CampusMindAI locally.

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/CampusMindAI.git
cd CampusMindAI
```

### 2. Backend Setup

```bash
cd backend

python -m venv venv
```

Activate the virtual environment:

**Windows PowerShell:**

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn app.main:app --reload
```

Backend API:

```text
http://127.0.0.1:8000
```

API Documentation:

```text
http://127.0.0.1:8000/docs
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend

npm install

npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 🔄 How It Works

1. **Student Registration:** Students create an account and securely log in.
2. **Complaint Submission:** Students submit their campus-related problems.
3. **AI Analysis:** The system analyzes complaints and helps identify their category and priority.
4. **Duplicate Detection:** Similar complaints are detected to minimize repetition.
5. **Admin Review:** Administrators review complaints through the admin dashboard.
6. **Status Management:** Admins update complaints as Open, In Progress or Resolved.
7. **Student Notifications:** Students receive updates about complaint progress.
8. **Analytics:** Administrators monitor complaint statistics through interactive visualizations.

---

## 🎯 Problem We Are Solving

Many educational institutions still struggle with:

- Delayed complaint resolution.
- Lack of transparency.
- Manual complaint management.
- Repeated or duplicate complaints.
- Poor communication between students and administration.
- Lack of centralized reporting and analytics.

**CampusMindAI brings all these processes together in one intelligent platform.**

---

## 🌟 Why CampusMindAI?

| Traditional System | CampusMindAI |
|---|---|
| Manual complaint handling | Digital complaint management |
| Difficult complaint tracking | Transparent status tracking |
| Repeated complaints | AI-assisted duplicate detection |
| Manual prioritization | Intelligent priority analysis |
| Limited reporting | Interactive analytics |
| Delayed communication | Status notifications |

---

## 🔮 Future Enhancements

- Advanced Large Language Model (LLM) integration.
- Multilingual complaint submission (Hindi & English).
- AI-powered resolution recommendations.
- Email and WhatsApp notifications.
- Mobile application for students.
- Predictive analytics for campus issues.
- Voice-based complaint submission.
- Advanced administrative reporting.

---

## 🌐 Live Application

**Experience CampusMindAI:**

🔗 https://campusmindai-iota.vercel.app/

---

## 👨‍💻 Developed With ❤️ By

**Team CampusMindAI**

Built with passion, innovation and technology to make campus life smarter.

**Project Category:** Artificial Intelligence | Web Development | EdTech

**Technologies:** Python • FastAPI • React • AI • SQLite

---

## 📜 License

This project is developed for educational, innovation and hackathon purposes.

---

<p align="center">

  **CampusMindAI — Your Voice. Our Intelligence. A Smarter Campus. 🚀**

  *Making Every Complaint Count!*

</p>
