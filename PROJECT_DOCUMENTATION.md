# ReUseHub — Master Project Documentation & Architecture Handbook

> **Project Vision**: ReUseHub is a verified campus-only circular economy marketplace that connects students to buy, sell, exchange, or give away textbooks, lab equipment, electronics, and dorm furniture. By facilitating safe offline handovers directly on campus, ReUseHub eliminates intermediary fees, stops usable academic gear from entering landfills, and saves students money.

---

## Table of Contents
1. [Executive Summary & Problem Statement](#1-executive-summary--problem-statement)
2. [High-Level System Architecture](#2-high-level-system-architecture)
3. [User Roles & Access Control (RBAC)](#3-user-roles--access-control-rbac)
4. [Core Business Workflows & Lifecycles](#4-core-business-workflows--lifecycles)
5. [Technology Stack Breakdown](#5-technology-stack-breakdown)
6. [Database Schema & Data Models (MongoDB)](#6-database-schema--data-models-mongodb)
7. [REST API Endpoint Reference](#7-rest-api-endpoint-reference)
8. [Design System & Frontend Architecture](#8-design-system--frontend-architecture)
9. [Security, Privacy & Campus Trust Model](#9-security-privacy--campus-trust-model)
10. [Setup, Execution & Verification Guide](#10-setup-execution--verification-guide)
11. [Demo Accounts & Test Credentials](#11-demo-accounts--test-credentials)

---

## 1. Executive Summary & Problem Statement

### 1.1 The Campus Problem
Every semester on college campuses worldwide:
- **Academic Waste**: Seniors and graduating students accumulate expensive physical textbooks (CLRS, Engineering Mathematics, Timoshenko Mechanics), scientific calculators (Casio ClassWiz), lab gear, drafting instruments, and dorm furniture (study chairs, desk lamps) that they no longer need.
- **Financial Burden on Freshers**: Incoming students are forced to purchase identical textbooks and equipment brand new at retail prices.
- **Dorm Shift Disposal**: During hostel room shifts and graduations, perfectly functional items are frequently abandoned or thrown into dumpsters due to lack of an organized campus channel.
- **Commercial Platform Pitfalls**: Mainstream classifieds (OLX, Craigslist, Facebook Marketplace) expose students to anonymous strangers, delivery scams, platform listing fees, and unsafe off-campus travel.

### 1.2 The ReUseHub Solution
ReUseHub provides an institution-verified, moderated digital ecosystem tailored specifically for university campuses:
- **Verified Student-Only Access**: Every registrant must provide a valid college email and student ID number, verified by campus administration before accessing marketplace transactions.
- **Zero Platform Fees**: Completely free for students. Transactions are 100% peer-to-peer.
- **Three Flexible Listing Models**:
  1. **Sell**: Students set a discounted cash/UPI price.
  2. **Giveaway**: 100% free items passed down from seniors to juniors.
  3. **Exchange**: Direct swap of academic resources (e.g., swapping Operating Systems notes for Computer Networks textbook).
- **Designated Safe Campus Meetups**: Handoffs occur directly at familiar campus landmarks (Central Library Steps, Student Center, Hostel Receptions).
- **Live Environmental Impact Tracking**: Automated calculation of carbon emissions avoided, e-waste diverted, and landfill volume saved per reused item.

---

## 2. High-Level System Architecture

ReUseHub is architected as a decoupled, asynchronous Single Page Application (SPA) backed by a high-performance RESTful API and cloud document store:

```mermaid
flowchart TD
    subgraph Client ["Client Layer (Browser)"]
        UI["React 19 SPA (Vite + Tailwind v4)"]
        State["TanStack React Query v5 & Context API"]
        Router["React Router v7 (Role-Based Protected Routes)"]
    end

    subgraph Gateway ["HTTP / API Layer"]
        FastAPI["FastAPI ASGI Application (Python 3.14)"]
        CORS["CORS Middleware (Allowed Origins)"]
        JWTAuth["JWT Authentication & RBAC Guard"]
        StaticServe["Static Upload File Mount (/uploads)"]
    end

    subgraph DataLayer ["Data & Persistence Layer"]
        Motor["Motor / PyMongo Asynchronous Driver"]
        MongoDB[("MongoDB Atlas Database ('fastapi_db')")]
        FS[("Local Filesystem (Uploaded Images)")]
    end

    UI -->|HTTP Requests / Bearer JWT| Gateway
    Router --> State
    State --> UI
    Gateway --> Motor
    Gateway --> StaticServe
    StaticServe --> FS
    Motor --> MongoDB
```

### Component Breakdown
- **Frontend SPA (`/UI`)**: Client-side rendered React 19 application built with Vite, styled with Tailwind CSS v4, with full Dark/Light theme switching, reactive TanStack Query caching, and custom SVG icons.
- **Backend API (`/backend`)**: Asynchronous FastAPI service organizing modular routers, Pydantic schemas, JWT security utilities, and MongoDB indexes.
- **Database (`fastapi_db`)**: Remote MongoDB Atlas cluster (with local MongoDB fallback) holding collections for users, items, requests, categories, and moderation reports.

---

## 3. User Roles & Access Control (RBAC)

ReUseHub enforces strict role-based authorization across client routes and backend API endpoints:

| Role | Verification Status | Accessible Features & Permissions |
| :--- | :--- | :--- |
| **Public Visitor** | None | • Browse public marketplace items<br>• Search and filter listings by category/type/condition<br>• View Sustainability Metrics dashboard<br>• Read How It Works and platform FAQs<br>• Access Login and Registration portals |
| **Student (Pending)** | `pending` | • Log in to student account<br>• View personal profile and pending verification status notice<br>• *Blocked from creating listings or sending item requests until approved* |
| **Student (Verified)** | `approved` | • Create, edit, and delete personal listings (Sell, Giveaway, Exchange)<br>• Upload item condition photos<br>• Send item pickup requests to other students<br>• Accept / reject incoming requests on own listings<br>• Schedule campus meetup locations & times<br>• Mark handovers as completed (increments sustainability stats)<br>• Report abusive listings or suspicious users |
| **Student (Rejected)** | `rejected` | • Account rejected due to invalid college credentials; read-only profile notice |
| **Administrator** | Pre-authorized | • Full access to Admin Command Center (`/admin`)<br>• Approve or reject student account verification requests<br>• Moderate and approve submitted item listings before public release<br>• Review campus pickup requests and transaction disputes<br>• Review, resolve, or dismiss student incident reports<br>• Create, edit, and manage marketplace categories<br>• View administrative platform metrics and circular economy audits |

---

## 4. Core Business Workflows & Lifecycles

### 4.1 Student Onboarding & Verification Workflow
```mermaid
sequenceDiagram
    autonumber
    actor Student
    actor Admin
    participant API as FastAPI Backend
    participant DB as MongoDB Atlas

    Student->>API: POST /api/auth/register (Email, Student ID, College, Password)
    API->>DB: Insert User with status: "pending", role: "student"
    API-->>Student: Account created (Verification pending)
    
    Admin->>API: GET /api/admin/students?status=pending
    API->>DB: Query pending students
    API-->>Admin: List of pending registrations
    
    Admin->>API: PUT /api/admin/students/{id}/verify (status: "approved")
    API->>DB: Update User verification_status = "approved"
    API-->>Admin: Student verified
    
    Student->>API: POST /api/auth/login
    API-->>Student: JWT Token issued with verified permissions
```

### 4.2 Item Listing & Moderation Lifecycle
Items follow a quality-control pipeline to prevent spam, counterfeit items, or off-topic listings:

```mermaid
stateDiagram-v2
    [*] --> PendingApproval: Student Submits Listing
    PendingApproval --> Approved: Admin Reviews & Approves
    PendingApproval --> Rejected: Admin Rejects (Inappropriate/Duplicate)
    Approved --> ActiveMarketplace: Published on Public Browse Page
    ActiveMarketplace --> Requested: Student Submits Pickup Request
    Requested --> HandoverScheduled: Owner Accepts & Schedules Meetup
    HandoverScheduled --> Reused: Handover Completed (Reused Status)
    Reused --> [*]: Logged in Sustainability Metrics
```

1. **Submission**: A verified student uploads title, description, category, listing model, condition, campus pickup point, and photo.
2. **Moderation**: Item enters `pending` approval.
3. **Publication**: Admin reviews details; once approved, item status becomes `approved` and appears on the public `/browse` page.
4. **Completion**: Once handed over, the item status changes to `reused` and is archived in student history.

### 4.3 The Three Listing Types

#### 1. Sell (`sell`)
- **Purpose**: Student recovers partial investment on high-value items (textbooks, scientific calculators, drafting boards).
- **Price**: Fixed rupee amount set by owner.
- **Payment**: Settled in-person via UPI or cash during physical handover. Zero commission taken by ReUseHub.

#### 2. Giveaway (`giveaway`)
- **Purpose**: Senior passing down materials to juniors for free.
- **Price**: Automatically ₹0 / "Free Campus Gift".
- **Impact**: Maximizes peer goodwill and campus zero-waste diversion.

#### 3. Direct Exchange (`exchange`)
- **Purpose**: Academic bartering. Student gives away one resource in exchange for another needed item.
- **Exchange Requirement**: Mandatory text field where the owner specifies what they seek (e.g., *"Looking for 4th semester Microprocessors lab kit"*).

### 4.4 Item Request & Campus Meetup Handover Workflow
1. **Request Creation**: A verified student clicks "Request Item" on an approved listing, specifying their intended use or exchange offer.
2. **Owner Review**: Listing owner receives the incoming request under `/my-requests` with the requester's name, department, and contact info.
3. **Acceptance & Scheduling**: Owner accepts request; both parties coordinate the precise campus meeting spot (e.g., *Central Library Foyer*) and time.
4. **Physical Inspection & Handshake**: Students meet on campus, inspect the item's physical condition, complete UPI/cash exchange if applicable.
5. **Completion**: Either student marks the transaction as **Completed** in the portal:
   - Item status transitions to `reused`.
   - ReUseHub recalculates campus-wide environmental diversion statistics.

### 4.5 Environmental Sustainability Tracking Engine
Whenever an item is marked as `reused`, ReUseHub's sustainability engine logs real environmental metrics based on lifecycle assessment (LCA) standards:
- **Textbooks & Notes**: ~2.4 kg to 2.8 kg CO₂ emissions avoided + 1,200 liters of pulp processing water saved per book reused.
- **Electronics & Calculators**: Prevents hazardous battery/silicon e-waste from municipal dumping + saves rare-earth manufacturing footprints.
- **Furniture & Chairs**: ~12 kg to 18 kg landfill material diverted per chair or study desk reused.

---

## 5. Technology Stack Breakdown

### Frontend (`/UI`)
| Technology | Version | Purpose in ReUseHub |
| :--- | :--- | :--- |
| **React** | `^19.0.0` | Declarative component UI library |
| **Vite** | `^8.3.5` | Fast modern frontend build tool & dev server |
| **Tailwind CSS** | `^4.0.0` | Modern utility CSS framework with `@custom-variant dark` support |
| **TanStack React Query** | `^5.62.0` | Server state management, auto-caching, optimistic UI updates |
| **React Router DOM** | `^7.1.0` | Client-side routing, protected route guards, navigation history |
| **Axios** | `^1.7.9` | HTTP client configured with JWT bearer authorization interceptor |
| **Icons.jsx** | Custom | Handcrafted lightweight vector SVG icons (0 external icon dependencies) |

### Backend (`/backend`)
| Technology | Version | Purpose in ReUseHub |
| :--- | :--- | :--- |
| **Python** | `3.14+` | Core programming language |
| **FastAPI** | `^0.115.0` | Modern, high-performance async REST framework |
| **Motor** | `^3.7.0` | Non-blocking async MongoDB driver for Tornado/asyncio |
| **PyMongo** | `^4.11.0` | Synchronous MongoDB driver used for indexing and seeding |
| **Pydantic v2** | `^2.10.0` | Strict data validation, request parsing, and response serialization |
| **Pydantic Settings** | `^2.7.0` | Multi-source environment variable management (`.env` loading) |
| **PyJWT** | `^2.10.0` | Stateless HMAC-SHA256 JWT token encoding & decoding |
| **Passlib & Bcrypt** | `^1.7.4` | Salted password hashing algorithm |
| **Uvicorn** | `^0.34.0` | Production-grade ASGI server implementation |

### Database & Storage
| Technology | Details |
| :--- | :--- |
| **MongoDB Atlas** | Remote cloud replica set cluster (`test.e72yqnq.mongodb.net`) running `fastapi_db` |
| **Static Storage** | Fast filesystem uploads mounted at `/uploads` for item images |

---

## 6. Database Schema & Data Models (MongoDB)

### 6.1 `users` Collection
Stores student credentials, institutional validation data, and roles:
```json
{
  "_id": "ObjectId",
  "full_name": "Asha Rao",
  "email": "asha@college.edu",
  "student_id": "STU1001",
  "college": "City College of Engineering",
  "phone": "+91 9876543210",
  "hashed_password": "$2b$12$...",
  "role": "student", // "student" | "admin"
  "verification_status": "approved", // "pending" | "approved" | "rejected"
  "created_at": "ISODate",
  "updated_at": "ISODate"
}
```

### 6.2 `categories` Collection
Pre-configured academic classifications:
```json
{
  "_id": "ObjectId",
  "name": "Books", // "Books" | "Study Materials" | "Electronics" | "Furniture" | "Other"
  "description": "Textbooks, reference manuals, exam guides, and novels",
  "created_at": "ISODate"
}
```

### 6.3 `items` Collection
Marketplace listings published by students:
```json
{
  "_id": "ObjectId",
  "name": "Introduction to Algorithms (CLRS 3rd Edition)",
  "description": "Standard MIT Press algorithms textbook. Minimal pencil notes. Clean condition.",
  "category_id": "ObjectId (ref: categories)",
  "owner_id": "ObjectId (ref: users)",
  "listing_type": "sell", // "sell" | "giveaway" | "exchange"
  "price": 750, // null if giveaway or exchange
  "condition": "good", // "brand_new" | "like_new" | "good" | "fair"
  "location": "Library Central Hall, 1st Floor",
  "exchange_requirement": null, // String if listing_type is exchange
  "image_url": "https://images.unsplash.com/photo-...",
  "status": "approved", // "pending" | "approved" | "rejected" | "reused"
  "created_at": "ISODate",
  "updated_at": "ISODate"
}
```

### 6.4 `requests` Collection
Tracks handover requests between prospective buyers/receivers and item owners:
```json
{
  "_id": "ObjectId",
  "item_id": "ObjectId (ref: items)",
  "requester_id": "ObjectId (ref: users)",
  "owner_id": "ObjectId (ref: users)",
  "status": "pending", // "pending" | "accepted" | "rejected" | "completed" | "cancelled"
  "message": "Hi, I need this for my 3rd semester DSA course. Can we meet today?",
  "proposed_location": "Central Library Steps",
  "proposed_time": "2026-11-05T15:30:00Z",
  "created_at": "ISODate",
  "updated_at": "ISODate"
}
```

### 6.5 `reports` Collection
Student safety and content moderation records:
```json
{
  "_id": "ObjectId",
  "reporter_id": "ObjectId (ref: users)",
  "reported_item_id": "ObjectId (ref: items, optional)",
  "reported_user_id": "ObjectId (ref: users, optional)",
  "reason": "Inaccurate description: book is missing chapter 5-8",
  "status": "pending", // "pending" | "reviewed" | "dismissed"
  "admin_notes": null,
  "created_at": "ISODate"
}
```

---

## 7. REST API Endpoint Reference

All endpoints are served under `/api`:

### 7.1 Authentication & Profile (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new student account (`pending` status) |
| `POST` | `/api/auth/login` | Public | Authenticate user & return Bearer JWT token |
| `GET` | `/api/auth/me` | Authenticated | Retrieve authenticated user profile |

### 7.2 Public Marketplace & Items (`/api/items`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/items` | Public | Browse approved listings (supports `search`, `category_id`, `listing_type`, `condition`) |
| `GET` | `/api/items/{id}` | Public | Get full details of a specific item |
| `POST` | `/api/items` | Verified Student | Submit new item listing for admin review |
| `GET` | `/api/items/my` | Verified Student | Get all listings posted by authenticated student |
| `PUT` | `/api/items/{id}` | Owner Student | Edit title, price, description, or pickup point |
| `DELETE` | `/api/items/{id}` | Owner Student | Delete an item listing |

### 7.3 Academic Categories (`/api/categories`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/categories` | Public | Retrieve list of all available categories |
| `POST` | `/api/categories` | Admin Only | Add a new academic category |
| `PUT` | `/api/categories/{id}` | Admin Only | Update an existing category |
| `DELETE`| `/api/categories/{id}` | Admin Only | Delete an existing category |

### 7.4 Request & Handover Negotiation (`/api/requests`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/requests` | Verified Student | Submit a handover request for an approved item |
| `GET` | `/api/requests/incoming` | Verified Student | View requests submitted by peers for user's items |
| `GET` | `/api/requests/outgoing` | Verified Student | View requests user has sent to other students |
| `PUT` | `/api/requests/{id}/status` | Owner / Requester | Update request status (`accepted`, `rejected`, `completed`, `cancelled`) |

### 7.5 Moderation & Safety Reports (`/api/reports`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/reports` | Verified Student | Report a fraudulent listing or problematic user |
| `GET` | `/api/reports` | Admin Only | List all submitted reports |
| `PUT` | `/api/reports/{id}` | Admin Only | Resolve or dismiss a submitted report |

### 7.6 Admin Command Center (`/api/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/dashboard` | Admin Only | Platform statistics, pending counts, and KPI aggregations |
| `GET` | `/api/admin/students` | Admin Only | List all students with verification filter (`pending`, `approved`, `rejected`) |
| `PUT` | `/api/admin/students/{id}/verify`| Admin Only | Approve or reject a student's verification |
| `GET` | `/api/admin/items` | Admin Only | List all listings across all states (`pending`, `approved`, `reused`) |
| `PUT` | `/api/admin/items/{id}/status`| Admin Only | Approve, reject, or archive an item listing |
| `GET` | `/api/admin/requests` | Admin Only | Global audit log of all peer handover requests |

### 7.7 Sustainability & Dashboards (`/api/dashboard`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard/sustainability`| Public | Aggregate campus metrics: total listed, reused, diverted carbon, active student count |
| `GET` | `/api/dashboard/student` | Verified Student | Personal reuse stats: listings, active requests, completed handovers |

---

## 8. Design System & Frontend Architecture

### 8.1 Modern Visual Aesthetic
- **Color Identity**: Emerald and Teal circular economy brand palette (`#064e3b`, `#059669`, `#0d9488`), complemented by distinct category accents (Royal Indigo for Student Trust, Amber for Giveaways, Purple for Exchanges).
- **Responsive Layout**: Designed mobile-first, adapting seamlessly across mobile phones, tablets, laptops, and ultra-wide campus displays.
- **Glassmorphism & Micro-Interactions**: Ambient gradient backdrops, frosted glass cards (`backdrop-blur-md`), gentle floating orbits, and smooth hover translations.

### 8.2 Dark & Light Theme System
ReUseHub includes full-stack theme switching:
- **Tailwind v4 Integration**: Uses `@custom-variant dark (&:where(.dark, .dark *));` in `index.css`.
- **Persistent State**: User preference is stored in `localStorage` (`theme: 'dark' | 'light'`) and defaults to the operating system's prefers-color-scheme.
- **One-Click Navbar Toggle**: Instant transition with dynamic SVG Sun/Moon icons, maintaining 100% readability and contrast across all pages, forms, tables, and modal dialogs.

### 8.3 Custom Vector SVG Icons (`Icons.jsx`)
To ensure cross-platform visual consistency without relying on platform-specific emojis, ReUseHub includes an internal SVG icon library:
- `BookIcon`, `LaptopIcon`, `ChairIcon`, `DocumentIcon`, `CalculatorIcon`, `PackageIcon`
- `LeafIcon`, `ZapIcon`, `ShieldCheckIcon`, `GraduationCapIcon`, `HandshakeIcon`
- `SunIcon`, `MoonIcon`, `SparklesIcon`, `CheckCircleIcon`, `MapPinIcon`, `ArrowRightIcon`

---

## 9. Security, Privacy & Campus Trust Model

1. **Email Domain & Institutional Validation**: Students register with their official college email and student ID number. Admin verification prevents outside commercial vendors or spammers from accessing the marketplace.
2. **Stateless JWT Authorization**: API sessions use signed HMAC-SHA256 JWT tokens with a 24-hour expiration (`1440 minutes`). Protected routes validate credentials on every request.
3. **No Direct Payment Gateway Risks**: By deliberately avoiding credit card storage or online escrow, ReUseHub completely eliminates payment processing fraud, chargeback disputes, and merchant transaction fees for students.
4. **Campus-Only Handoffs**: Pickup takes place at designated, well-lit campus landmarks, ensuring physical security and eliminating delivery shipping hazards.
5. **CORS Hardening**: Strict origin whitelist restricts API invocation exclusively to authorized frontend hosts (`http://localhost:5173`, `http://127.0.0.1:5173`).

---

## 10. Setup, Execution & Verification Guide

### 10.1 Prerequisites
- **Python**: Version `3.11+` (tested on Python `3.14`)
- **Node.js**: Version `18.0+`
- **Database**: Access to MongoDB Atlas (pre-configured) or local MongoDB on port `27017`

### 10.2 Backend Setup & Execution
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   # Windows PowerShell
   python -m venv .venv
   .venv\Scripts\Activate.ps1
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure `.env` file (`backend/.env`):
   ```env
   MONGODB_URI=mongodb+srv://shineinfosoft84_db_user:aVP6vx4B7YpZBgWy@test.e72yqnq.mongodb.net
   DATABASE_NAME=fastapi_db
   JWT_SECRET=67624990837e45d6839ddcdcc9cef26dee449c193e38a18550397078b1fb7dd6
   JWT_ALGORITHM=HS256
   JWT_EXPIRE_MINUTES=1440
   UPLOAD_DIR=uploads
   CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
   ```
5. *(Optional)* Seed initial sample data:
   ```bash
   python -m app.seed
   ```
6. Start the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   - **API Base URL**: `http://localhost:8000`
   - **Interactive API Documentation (Swagger)**: `http://localhost:8000/docs`

### 10.3 Frontend Setup & Execution
1. Open a new terminal and navigate to the UI directory:
   ```bash
   cd UI
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Configure `.env` file (`UI/.env`):
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   - **Application URL**: `http://localhost:5173`

### 10.4 Automated Verification Suite
To verify end-to-end API integrity across all 12 core flows, execute the automated test runner:
```bash
python backend/test_flows.py
```
**Expected Output**:
```
--- 1. Testing Health Endpoint ---
[PASS] Health check OK: {'status': 'ok'}
--- 2. Testing Public Categories ---
[PASS] Found 5 categories
--- 3. Testing Public Browse Items ---
[PASS] Found approved items publicly available
--- 4. Testing Sustainability Dashboard ---
[PASS] Sustainability metrics calculated successfully
--- 5. Testing Admin Login ---
[PASS] Admin logged in: Admin (admin)
...
==========================================
ALL API ENDPOINTS & FLOWS PASSED TEST!
==========================================
```

---

## 11. Demo Accounts & Test Credentials

The database comes pre-seeded with tested user accounts across all platform roles:

### 11.1 Administrator Account
| Parameter | Value |
| :--- | :--- |
| **Email** | `admin@reusehub.com` |
| **Password** | `Admin@123` |
| **Role** | `admin` |
| **Purpose** | Student verification, listing approvals, report handling, category management |

### 11.2 Pre-Verified Student Accounts
All pre-verified students share the password: `Student@123`

| Name | Email | Student ID | Department / College | Sample Listings |
| :--- | :--- | :--- | :--- | :--- |
| **Asha Rao** | `asha@college.edu` | `STU1001` | Computer Science | Algorithms CLRS 3rd Ed., Scientific Calc |
| **Rahul Mehta** | `rahul@college.edu` | `STU1002` | Mechanical Eng. | Concepts of Physics, Mini Drafter |
| **Priya Nair** | `priya@college.edu` | `STU1003` | Electrical Eng. | Silberschatz OS Dinosaur Book, Multimeter |
| **Ankit Sharma** | `ankit@college.edu` | `STU1004` | Civil Eng. | B.S. Grewal Engineering Math |
| **Sneha Patel** | `sneha@college.edu` | `STU1005` | Information Tech. | Head First Design Patterns |
| **Vikram Aditya** | `vikram@college.edu`| `STU1006` | Electronics | Engineering Mechanics Timoshenko |
| **Kavita Deshmukh**| `kavita@college.edu`| `STU1007` | Architecture | Ergonomic Study Chair, Drafting Board |

---

*Authored for the ReUseHub Engineering & Product Team — Student-Led Campus Circular Economy.*

