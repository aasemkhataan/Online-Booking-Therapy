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
- [ ] Add Seeder script for users/doctors/sessions
- [ ] Enable CORS with proper config

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
   `npm start`

---

## 👤 Author

Developed with ❤️ by **Aasem Khataan**

---
