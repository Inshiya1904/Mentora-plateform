# Mentora Backend API

## Overview

Mentora is a backend system for a mentorship platform where **parents, students, and mentors interact**.

Parents can create student profiles, mentors can create lessons and sessions, and students can attend those sessions.

The backend also integrates **AI capabilities using a Large Language Model (LLM)** to:

* Summarize long text
* Generate AI-powered answers to questions

This project demonstrates:

* REST API design
* Authentication and authorization
* Clean backend architecture
* Data integrity between related entities
* AI integration

---

# Tech Stack

* Node.js
* Express.js
* TypeScript
* MongoDB
* Mongoose
* JWT Authentication
* Zod Validation
* Groq LLM API (Llama Model)

Additional tools:

* Helmet (security headers)
* Morgan (request logging)
* express-rate-limit (API protection)

---

# Backend Architecture

The project follows a **layered architecture** to maintain separation of concerns.

```
Routes
   ↓
Controllers
   ↓
Services (Business Logic)
   ↓
Models (Database)
```

Additional layers:

```
Middleware → Authentication, Authorization, Error Handling
Validators → Request validation using Zod
Utils → Helper functions (JWT generation)
Config → Environment configuration
```

Benefits:

* Cleaner controllers
* Reusable business logic
* Improved scalability
* Better maintainability

---

# User Roles

## Parent

* Can sign up
* Can create student profiles
* Can book lessons for students
* Can join sessions for their students

## Mentor

* Can sign up
* Can create lessons
* Can create sessions for lessons they own

## Student

* Created by parents
* Can attend sessions
* Can ask AI questions

---

# Authentication

JWT-based authentication is implemented.

Passwords are securely hashed using **bcrypt** before storing in the database.

### Endpoints

```
POST /auth/signup
POST /auth/login
GET /auth/me
```

Protected routes require a **valid JWT token**.

---

# Student Management

Parents can create and view students linked to their account.

### Endpoints

```
POST /students
GET /students
```

Security rules:

* Only parents can create students
* Students always belong to the parent who created them

---

# Lesson System

Mentors create lessons for students.

### Endpoints

```
POST /lessons
GET /lessons
PATCH /lessons/:id
```

Features:

* Lesson creation restricted to mentors
* Pagination support
* Mentor ownership validation before updates

---

# Booking System

Parents assign their students to lessons.

### Endpoint

```
POST /bookings
```

Validation includes:

* Student must belong to parent
* Lesson must exist
* Duplicate bookings are prevented

Critical operations use **MongoDB transactions** to ensure data integrity.

---

# Session System

Each lesson may contain multiple sessions.

### Endpoints

```
POST /sessions
GET /lessons/:id/sessions
POST /sessions/:id/join
```

Features:

* Mentors create sessions
* Parents join sessions for their students
* Ownership checks ensure data integrity
* Duplicate session joins prevented
* Session results populated with lesson and student info

---

# AI Features (LLM Integration)

The backend integrates a **Large Language Model** to enhance learning capabilities.

Two AI endpoints are available.

---

# 1. Text Summarization

Generates concise summaries from long text.

### Endpoint

```
POST /llm/summarize
```

### Request

```json
{
"text": "Artificial intelligence is transforming industries including healthcare..."
}
```

### Response

```json
{
"summary": "• AI transforming healthcare, finance and education\n• Machine learning improves disease detection\n• AI automates financial analysis",
"model": "llama-3.3-70b-versatile"
}
```

---

# 2. AI Question Answering

Allows students to ask questions and receive AI-generated explanations.

### Endpoint

```
POST /llm/ask
```

### Request

```json
{
"question": "What is supervised learning?"
}
```

### Response

```json
{
"answer": "Supervised learning is a machine learning technique where a model learns from labeled data.",
"model": "llama-3.3-70b-versatile"
}
```

---

# Validation

The project uses **Zod schemas** for request validation.

Validation is applied to:

* Authentication requests
* Student creation
* Lesson creation
* Booking creation
* Session creation
* AI endpoints

Benefits:

* Prevents invalid data
* Ensures consistent API behavior
* Improves security

---

# Rate Limiting

To prevent abuse of AI endpoints:

```
10 requests per minute per IP
```

Implemented using:

```
express-rate-limit
```

---

# Security Practices

The backend includes multiple security improvements:

* JWT authentication
* Password hashing (bcrypt)
* Role-based authorization
* Ownership validation between entities
* Zod schema validation
* Helmet security headers
* Morgan request logging
* Environment variable validation
* Rate limiting for AI endpoints
* API keys stored securely in environment variables

---

# Environment Variables

Create a `.env` file in the project root.

Example:

```
PORT=3000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
GROQ_API_KEY=your_groq_api_key
```

⚠ Never commit `.env` files to GitHub.

---

# Installation

Clone the repository

```
git clone https://github.com/Inshiya1904/Mentora-plateform.git
cd mentora-plateform
```

Install dependencies

```
npm install
```

Run the server

```
npm run dev
```

Server will start at:

```
http://localhost:3000
```

---

# Testing the LLM Endpoint

Example using curl:

```
curl -X POST http://localhost:3000/llm/summarize \
-H "Content-Type: application/json" \
-d '{
"text":"Artificial intelligence is transforming industries..."
}'
```

---

# Assumptions

* Summaries return **3–6 bullet points**
* Maximum summary length ~120 words
* Text input must be between **50 and 10,000 characters**
* AI responses generated using Groq Llama models
* Rate limiting protects LLM endpoints

---

