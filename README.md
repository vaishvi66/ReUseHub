# ReUseHub — Student-Led Campus Circular Economy Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19.0-61DAFB.svg?style=flat&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF.svg?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4.0-38B2AC.svg?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

> ReUseHub is an institutional campus marketplace where verified university students buy, sell, exchange, or give away textbooks, lab tech, calculators, drafting tools, and dorm furniture. Transactions happen directly peer-to-peer on campus with zero platform fees, verified student IDs, and live environmental circular economy metrics.

---

## 📖 Complete Master Documentation
For the complete, in-depth architectural breakdown, database models, user lifecycles, API reference, and security specifications, see:
👉 **[PROJECT_DOCUMENTATION.md](file:///c:/Users/Divyesh%20Thakor/Desktop/freelance/ReUseHub/PROJECT_DOCUMENTATION.md)**

---

## ⚡ Quick Start

### 1. Backend (FastAPI + MongoDB Atlas)
```bash
# Navigate to backend
cd backend

# Create & activate virtual environment (Windows PowerShell)
python -m venv .venv
.venv\Scripts\Activate.ps1

# Install Python packages
pip install -r requirements.txt

# Run FastAPI development server
uvicorn app.main:app --reload --port 8000
```
- API Health: `http://localhost:8000/api/health`
- Swagger UI Docs: `http://localhost:8000/docs`

### 2. Frontend (React 19 + Vite + Tailwind v4)
```bash
# In a new terminal, navigate to UI
cd UI

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
- Application Web App: `http://localhost:5173`

### 3. Automated API Test Suite
```bash
python backend/test_flows.py
```

---

## 🔑 Demo Login Accounts

All student accounts use the password: `Student@123`

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@reusehub.com` | `Admin@123` | Student verification, listing approval, category management, reports |
| **Student** | `asha@college.edu` | `Student@123` | Pre-verified student (CSE, 4th Year) |
| **Student** | `rahul@college.edu` | `Student@123` | Pre-verified student (Mechanical, 3rd Year) |
| **Student** | `priya@college.edu` | `Student@123` | Pre-verified student (EE, 2nd Year) |

---

## 🌟 Key Platform Features
- **Student ID & Institutional Email Verification**: Campus-only security perimeter.
- **Three Listing Modes**: *Sell* (fixed ₹ via UPI/cash), *100% Free Giveaway*, and *Direct Academic Barter/Exchange*.
- **Live Sustainability Tracking**: Calculates kg of CO₂ avoided, e-waste prevented, and landfill volume diverted.
- **Full Dark & Light Themes**: Accessible, persistent high-contrast interface.
- **Designated Campus Pickup Zones**: In-person handshakes at libraries, student centers, and dorm gates.
