# Aster To-Do List API – Team 6

**Developed by:**
- Daniel Ferrer
- Greyson Brummer
- Jason Springer-Trammell
- Lucas De Oliveira


# Overview

**Aster is a Node.js REST API for managing personal and team-oriented tasks. It supports:**
- User authentication with JWT
- Secure password hashing via bcrypt
- Task management with categories and tags
- Role-based permissions (User, Manager, Admin)
- Ownership-based resource access
- Extensible architecture for future web & mobile clients

Aster serves as a robust backend for any productivity or team task-tracking application.


# Features

User Accounts: Register, login, manage profile
JWT Authentication with refresh & logout

Tasks: Create, edit, delete, categorize, tag

Categories: Organizational grouping for tasks

Tags: Flexible labeling system

Roles:
- User: Manage own tasks
- Manager: View all user tasks
- Admin: Manage roles & delete users

Secure Access Control using middleware


# Technology Stack
- Node.js
- Express.js
- PostgreSQL (or other SQL database)
- JWT Authentication
- bcrypt Password Hashing
- Jest for testing


# Getting Started

**1. Clone the project**
git clone https://github.com/your-repo/aster-api.git
cd aster-api

**2. Install dependencies**
npm install

**3. Create environment file**
PORT=3000
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=some_time (15m)
DATABASE_URL=postgres://...

**4. Run migrations**
npx prisma migrate dev

**5. Seed database**
npm run seed

**6. Start the server**
npm run dev


**API will run at:**
http://localhost:3000

**Swagger UI will run at:**
http://localhost:3000/api-docs
