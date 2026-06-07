# Students Moving and Transport Service

A full-stack moving-service management platform that connects customers, administrators, and student workers in one coordinated workflow. The system supports customer authentication, quote requests, admin-side pricing and operations, student onboarding, and live job-progress updates.

## Submission Context

This project is submitted to a **Web Development Hackathon** as a practical full-stack web solution for managing a real moving-service workflow. It is centered around a **student-driven moving startup** created to help students afford and manage their daily living costs and academic expenses while building real work experience.

## Overview

This project was built to digitize the complete moving-service lifecycle:

- Customers can create accounts, request move quotes, track quote status, and view job progress.
- Admins can review requests, calculate pricing, confirm jobs, manage student workers, and monitor operations.
- Students can register, verify their identity, and accept jobs using their generated student ID.

At its core, the platform represents a student-led startup model where students earn through organized moving jobs to support tuition, study needs, and day-to-day expenses.

The application is split into two main parts:

- `Client/` - React + Vite frontend
- `Server/` - Node.js + Express + MongoDB backend

## Key Features

### Platform Highlights

- Multi-factor authentication flow using OTP verification with JWT-based session authentication
- Real-time capabilities powered by Socket.IO for quote, staffing, and job-progress updates
- Admin dashboard with quote management, student management, work assignment, and job-progress control
- Student employee module with registration, student ID generation, OTP verification, and work-accept UI
- Customer dashboard with a multi-step quote generation form, detailed quote breakdown, acceptance or rejection flow, stat cards, and profile editing

### Customer Module

- Secure signup and login flow
- Pre-signup phone OTP verification
- Pre-signup email OTP verification
- Forgot-password and reset-password support
- Protected customer dashboard
- Multi-step move quote request form
- Quote history and quote detail view
- Customer profile management
- Live updates when quote or job status changes

### Admin Module

- Admin dashboard with summary statistics
- Quote management with search, pagination, and status filters
- Detailed quote review screen
- Price estimator for distance, labor, trucks, drivers, tax, and special items
- Job creation after quote confirmation
- Operations panel for active jobs
- Live work-progress updates
- Student approval, rejection, and blocking controls
- Student statistics dashboard

### Student Module

- Student registration form
- Unique student ID generation
- Phone OTP verification
- Email verification link flow
- Job acceptance using student ID
- Preferred task selection and availability confirmation
- Real-time job slot updates

### Realtime Features

- Quote updates pushed via Socket.IO
- Student acceptance events pushed in real time
- Job progress updates pushed in real time
- Student-stat refresh events for admin dashboard

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Tailwind CSS
- Framer Motion
- Socket.IO Client

### Backend

- Node.js
- Express 5
- MongoDB with Mongoose
- JWT authentication with cookies
- Twilio for SMS OTP
- Nodemailer for email verification and password reset
- Socket.IO

## Third-Party Libraries and Versions

### Client Dependencies

| Library | Version |
|---|---|
| `@tailwindcss/vite` | `^4.1.17` |
| `axios` | `^1.13.2` |
| `framer-motion` | `^12.34.3` |
| `jwt-decode` | `^4.0.0` |
| `lucide-react` | `^0.560.0` |
| `react` | `^19.2.0` |
| `react-dom` | `^19.2.0` |
| `react-phone-number-input` | `^3.4.16` |
| `react-router-dom` | `^7.10.1` |
| `socket.io-client` | `^4.8.3` |
| `tailwindcss` | `^4.1.17` |

### Client Dev Dependencies

| Library | Version |
|---|---|
| `@eslint/js` | `^9.39.1` |
| `@types/react` | `^19.2.5` |
| `@types/react-dom` | `^19.2.3` |
| `@vitejs/plugin-react` | `^5.1.1` |
| `eslint` | `^9.39.1` |
| `eslint-plugin-react-hooks` | `^7.0.1` |
| `eslint-plugin-react-refresh` | `^0.4.24` |
| `globals` | `^16.5.0` |
| `vite` | `^7.2.4` |

### Server Dependencies

| Library | Version |
|---|---|
| `bcryptjs` | `^3.0.3` |
| `cookie-parser` | `^1.4.7` |
| `cors` | `^2.8.5` |
| `crypto` | `^1.0.1` |
| `dotenv` | `^17.2.3` |
| `ejs` | `^3.1.10` |
| `express` | `^5.2.1` |
| `express-rate-limit` | `^8.2.1` |
| `express-session` | `^1.18.2` |
| `handlebars` | `^4.7.8` |
| `jsonwebtoken` | `^9.0.3` |
| `libphonenumber-js` | `^1.12.38` |
| `mongoose` | `^9.1.1` |
| `nodemailer` | `^7.0.12` |
| `nodemon` | `^3.1.11` |
| `socket.io` | `^4.8.3` |
| `twilio` | `^5.13.1` |

## Project Structure

```text
Students Moving and Transport Service/
|-- Client/
|   |-- src/
|   |   |-- components/
|   |   |-- config/
|   |   |-- context/
|   |   |-- hooks/
|   |   `-- socket-connection/
|   `-- package.json
|-- Server/
|   |-- config/
|   |-- controller/
|   |-- middelware/
|   |-- models/
|   |-- routes/
|   |-- src/
|   `-- utils/
|-- README.md
|-- Submission-Report.md
|-- Submission-Report.html
`-- Submission-Report.pdf
```

## Main Workflow

1. A customer signs up and verifies phone and email.
2. The customer logs in and submits a move quote request.
3. The backend calculates route location and distance from postal codes.
4. The admin reviews the request and prepares a detailed price estimate.
5. The customer accepts or rejects the quote.
6. If accepted, the admin creates a job and opens it for students.
7. Registered and verified students apply using their student ID.
8. The admin monitors job staffing and updates work progress.
9. Customers receive live status updates during the move lifecycle.

## API Modules

- `api/auth` - authentication, OTP, profile, password reset
- `api/quotes` - quote submission, quote listing, invoice updates, customer response
- `api/jobs` - job creation, student acceptance, job progress
- `api/students` - student registration, verification, management
- `api/contact` - contact/support form submission and contact details

## Environment Variables

### Backend

```env
MONGO_URI=
JWT_SECRET=
JWT_EXPIRES=
PORT=3000
FRONTEND_URL=http://localhost:5173

TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
DEFAULT_COUNTRY_CODE=+91

HOST_EMAIL=
HOST_PASS=

SUPPORT_COMPANY_NAME=
SUPPORT_ADDRESS=
SUPPORT_PHONE=
SUPPORT_EMAIL=
SUPPORT_MAP_EMBED=
```

### Frontend

```env
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

## Local Setup

### Backend

```bash
cd Server
npm install
npm start
```

### Frontend

```bash
cd Client
npm install
npm run dev
```

Frontend default:

- `http://localhost:5173`

Backend default:

- `http://localhost:3000`

## Build Status

Frontend production build was successfully generated with:

```bash
cd Client
npm run build
```

## Submission Hardening Completed

The current version includes a focused cleanup pass for submission readiness:

- Added backend authorization for admin-only quote, job, and student-management routes
- Separated customer quote response from generic admin quote updates
- Fixed student route ordering for `/stats/summary`
- Standardized frontend API and socket configuration through shared env-based config
- Fixed contact page integration to use the active backend endpoints
- Improved contact request validation
- Updated auth cookie settings for production safety
- Corrected student availability stats logic

## Remaining Improvement Areas

- Clean remaining lint issues for a fully polished codebase
- Add automated tests
- Optimize large image assets and bundle size
- Expand deployment documentation and hosting setup

## Future Improvements

- Payment integration
- Feedback and rating module
- Admin activity logs
- Advanced analytics dashboard
- PDF invoice generation
- Customer notifications through WhatsApp or email

## Author

Swapnil Dhotre

## Submission Documents

- [Submission Report](./Submission-Report.md)
- [Submission Report HTML](./Submission-Report.html)
- [Submission Report PDF](./Submission-Report.pdf)
