# 🧠 Online Therapy Booking API

This project is a fully featured RESTful API for an **Online Therapy Booking System**, inspired by platforms like Shezlong. It enables users to book therapy sessions with doctors, manage availability, authenticate via JWT or Google, and much more.

---

## 🚀 Features

- 👥 **User & Doctor Authentication** (JWT + Google OAuth)
- 🔐 **Security Middleware**: Helmet, XSS-clean, HPP, Rate Limiting
- 📅 **Doctor Availability Management**
- 📆 **Session Booking & Cancellation**
- ✉️ **Email Notifications** on session updates
- 🧠 **User Roles & Access Control**
- ✅ **Zod Validation** for request bodies
- 📂 **MVC Architecture** for clean code structure
- 🌐 **RESTful Routes** for Doctors, Sessions, Users, Availability
- 📈 **Custom API Features**: Filtering, Sorting, Pagination

---

## 📁 Project Structure

```
.
├── app.js
├── server.js
├── config/                # Passport strategy, DB configs
├── controllers/           # Route logic
├── models/                # Mongoose models
├── routes/                # Express routes
├── utils/                 # Helper utilities (error handler, security, etc)
├── validators/            # Zod-based request validation
├── services/              # Business logic (e.g., authService)
├── .env                   # Environment variables
├── package.json
└── ...
```

---

## 🛠️ Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- Zod (for validation)
- JWT & Google OAuth 2.0
- Nodemailer
- Helmet, Rate-limit, HPP, XSS-clean
- Prettier

---

## 🧪 To-Do

- [ ] Add Unit & Integration Tests using Jest & Supertest
- [ ] Add Swagger or Postman API Documentation
- [ ] Setup Winston/Pino for logging errors
- [ ] Add `.env.example` file
- [ ] Add Seeder script for users/doctors/sessions
- [ ] Enable CORS with proper config
- [ ] Integrate Stripe (or other) for session payments

---

## 🧠 Getting Started

1. **Clone the repo**  
   `git clone https://github.com/YOUR_USERNAME/Online-Booking-Therapy.git`

2. **Install dependencies**  
   `npm install`

3. **Setup `.env` file** with your credentials:

```
PORT=3000
DATABASE=mongodb://localhost:27017/therapy
JWT_SECRET=your_secret
EMAIL_USER=your_email
EMAIL_PASS=your_password
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
```

4. **Run the server**  
   `npm run dev`

---

## 👤 Author

Developed with ❤️ by **Aasem Khataan**

---

## 📄 License

## This project is licensed under the MIT License.

## 📡 API Endpoints

### 🔐 Auth Routes (`/api/v1/auth`)

| Method | Endpoint                | Description                 |
| ------ | ----------------------- | --------------------------- |
| POST   | `/signup`               | Register a new user         |
| POST   | `/login`                | Login with email & password |
| POST   | `/forgotPassword`       | Send reset token via email  |
| PATCH  | `/resetPassword/:token` | Reset password with token   |
| GET    | `/google`               | Redirect to Google OAuth    |
| GET    | `/google/callback`      | Google OAuth callback       |
| GET    | `/logout`               | Logout user                 |

---

### 👤 User Routes (`/api/v1/users`)

| Method | Endpoint    | Description                     |
| ------ | ----------- | ------------------------------- |
| GET    | `/me`       | Get current logged-in user info |
| PATCH  | `/updateMe` | Update user profile             |
| DELETE | `/deleteMe` | Deactivate own account          |

---

### 🧑‍⚕️ Doctor Routes (`/api/v1/doctors`)

| Method | Endpoint | Description                     |
| ------ | -------- | ------------------------------- |
| GET    | `/`      | Get all doctors                 |
| GET    | `/:id`   | Get doctor by ID                |
| PATCH  | `/:id`   | Update doctor info (admin only) |
| DELETE | `/:id`   | Delete doctor (admin only)      |

---

### 📅 Availability Routes (`/api/v1/availability`)

| Method | Endpoint   | Description                          |
| ------ | ---------- | ------------------------------------ |
| GET    | `/`        | Get availability of logged-in doctor |
| POST   | `/`        | Create availability slots            |
| DELETE | `/:slotId` | Delete a specific slot               |

---

### 📆 Session Routes (`/api/v1/sessions`)

| Method | Endpoint      | Description                          |
| ------ | ------------- | ------------------------------------ |
| GET    | `/`           | Get all sessions (admin only)        |
| POST   | `/`           | Create new session booking           |
| GET    | `/me`         | Get sessions for current user/doctor |
| PATCH  | `/:id/cancel` | Cancel a session                     |

---

### 🛡️ Admin Routes (`/api/v1/admin`)

### 👥 Users

| Method | Endpoint     | Description    |
| ------ | ------------ | -------------- |
| GET    | `/users`     | Get all users  |
| GET    | `/users/:id` | Get user by ID |

### 🧑‍⚕️ Doctors

| Method | Endpoint               | Description                    |
| ------ | ---------------------- | ------------------------------ |
| GET    | `/doctors`             | Get all doctors (admin view)   |
| DELETE | `/doctors`             | Delete all doctors             |
| GET    | `/doctors/:id`         | Get single doctor (admin view) |
| PATCH  | `/doctors/:id`         | Update doctor                  |
| DELETE | `/doctors/:id`         | Delete doctor                  |
| PATCH  | `/doctors/:id/approve` | Approve a doctor               |
| PATCH  | `/doctors/:id/suspend` | Suspend a doctor               |

### 🗓️ Sessions

| Method | Endpoint        | Description          |
| ------ | --------------- | -------------------- |
| GET    | `/sessions`     | Get all sessions     |
| DELETE | `/sessions`     | Delete all sessions  |
| GET    | `/sessions/:id` | Get session by ID    |
| PATCH  | `/sessions/:id` | Update session by ID |
| DELETE | `/sessions/:id` | Delete session by ID |
