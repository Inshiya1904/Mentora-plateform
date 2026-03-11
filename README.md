# Mentora Backend API

## Overview

Mentora is a simplified backend system for a mentorship platform where **parents, students, and mentors interact**.

Parents can create student profiles, mentors can create lessons and sessions, and students can attend those sessions.

The project also integrates **AI capabilities using a Large Language Model (LLM)** to:

* Summarize long text
* Provide AI-generated answers to questions

The backend demonstrates **API design, authentication, role-based authorization, database modeling, and AI integration**.

---

# Tech Stack

* Node.js
* Express.js
* TypeScript
* MongoDB
* Mongoose
* JWT Authentication
* Groq LLM API (Llama Model)

---

# Project Architecture

The project follows a **layered architecture** for clean separation of concerns:

```
Controllers → Business Logic
Routes → API Endpoints
Middleware → Authentication & Authorization
Services → External APIs (LLM)
Models → Database Schemas
```

Example: the LLM routes call controller functions which then call service functions for the actual AI request. 

---

# User Roles

## Parent

* Can sign up
* Can create student profiles
* Can book lessons
* Can join sessions for their student

## Mentor

* Can sign up
* Can create lessons
* Can create sessions

## Student

* Created by parents
* Can attend sessions
* Can ask AI questions related to sessions

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

Example signup logic validates user input and generates a JWT token. 

---

# Student Management

Parents can create and view students.

### Endpoints

```
POST /students
GET /students
```

Students are always associated with the parent who created them. 

---

# Lesson System

Mentors can create lessons for students.

### Endpoints

```
POST /lessons
GET /lessons
PATCH /lessons/:id
```

Features:

* Lesson creation by mentors only
* Pagination support for listing lessons
* Mentor ownership validation before updates 

---

# Booking System

Parents can assign students to lessons.

### Endpoint

```
POST /bookings
```

The API validates:

* Student belongs to parent
* Lesson exists
* Duplicate booking prevention 

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
* Parents can join sessions for their students
* Duplicate join prevention
* Session results populated with lesson and student info 

---

# AI Features (LLM Integration)

The project integrates a **Large Language Model** to enhance learning capabilities.

Two AI endpoints are provided.

---

# 1. Text Summarization

Generates concise summaries from long text input.

### Endpoint

```
POST /llm/summarize
```

### Request

```json
{
"text": "Artificial intelligence is transforming industries including healthcare, finance, and education..."
}
```

### Response

```json
{
"summary": "• AI transforming healthcare, finance and education\n• Machine learning improves disease detection\n• AI automates financial analysis\n• Education platforms use AI for personalized learning",
"model": "llama-3.3-70b-versatile"
}
```

The summarization endpoint is protected with rate limiting to avoid abuse. 

---

# 2. AI Question Answering

Students can ask questions and receive AI-generated explanations.

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
"answer": "Supervised learning is a machine learning technique where a model learns from labeled training data and uses that knowledge to make predictions.",
"model": "llama-3.3-70b-versatile"
}
```

---

# Validation Rules

For the summarization endpoint:

| Condition               | Response              |
| ----------------------- | --------------------- |
| Text missing            | 400 Bad Request       |
| Text < 50 characters    | 400 Bad Request       |
| Text > 10000 characters | 413 Payload Too Large |

These validations are implemented inside the LLM controller. 

---

# Rate Limiting

To prevent abuse, the LLM endpoints use basic rate limiting:

```
10 requests per minute per IP
```

Implemented using `express-rate-limit`. 

---

# Security Practices

This project follows important security guidelines:

* API keys are **not hardcoded**
* API keys are loaded using **environment variables**
* JWT authentication
* Password hashing with bcrypt
* Role-based access control
* Input validation
* Rate limiting for AI endpoints

Authorization middleware verifies the JWT token before allowing protected routes. 

---

# Environment Variables

Create a `.env` file in the project root.

Example:

```
PORT=3000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
GROQ_API_KEY=your_api_key
```

API keys must **never be committed to GitHub**.

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
"text":"Artificial intelligence is rapidly transforming industries including healthcare, finance and education..."
}'
```

---

# Assumptions

* Summaries are returned in **3–6 bullet points**
* Maximum summary length ~120 words
* Text input must be between **50 and 10,000 characters**
* Rate limit is applied to prevent abuse
* LLM responses are generated using Groq Llama models

---



