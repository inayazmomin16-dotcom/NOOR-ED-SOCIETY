# 🏫 Noor Education Society
## Smart School Management & E-Learning Portal

A full-stack **Smart School Management & E-Learning Portal** developed for **Noor Education Society** to provide a modern digital platform for managing school information, notices, gallery content, schedules, and e-learning materials.

The project includes a responsive frontend, Node.js and Express.js backend, MongoDB database integration, file uploads, and an admin management system.

---

## 📌 Project Overview

The Noor Education Society portal is designed to bring important school activities and information into one centralized web application.

The system provides:

- School information and introduction
- Notices and announcements
- School gallery
- Schedule management
- E-learning materials
- Admin dashboard
- Database-driven content management
- File upload and management
- Responsive user interface

The project was designed with a focus on a clean, simple, and user-friendly interface suitable for students, teachers, administrators, and visitors.

---

## ✨ Features

### 🏠 School Website

- Home page
- About School
- School history
- Vision and mission
- Infrastructure information
- Achievements
- Contact page
- Responsive navigation

### 📢 Notice Management

Administrators can:

- Add notices
- View notices
- Edit notices
- Delete notices
- Manage school announcements

### 🖼️ Gallery Management

Administrators can:

- Upload gallery images
- View gallery items
- Edit gallery information
- Delete gallery items

### 📅 Schedule Management

Administrators can:

- Upload schedules
- View uploaded schedules
- Open schedule documents
- Delete schedules

### 📚 E-Learning Management

Administrators can upload and manage:

- Notes
- Assignments
- Question papers
- Syllabus
- Educational documents
- Educational videos

Materials can be organized according to class and category.

### 👨‍💼 Admin Dashboard

The admin panel provides centralized management for:

- Notices
- Gallery
- Schedules
- E-learning materials
- Dashboard statistics
- Admin login

### 🔐 Admin Login

The project includes an admin authentication system using:

- Username and password
- Password hashing with `bcryptjs`
- JWT-based authentication

### 📁 File Uploads

The backend supports file uploads for:

- Gallery images
- E-learning materials
- Schedule PDFs

Uploaded files are served through the backend `/uploads` route.

---

## 🛠️ Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript
- Font Awesome
- Google Fonts
- Responsive Web Design

### Backend

- Node.js
- Express.js
- REST APIs
- Multer
- JWT
- bcryptjs
- CORS
- dotenv

### Database

- MongoDB
- Mongoose

### Design

- Figma
- Responsive UI design
- Mobile-first interface concepts

### Development Tools

- Visual Studio Code
- Git
- GitHub
- npm

---

## 🏗️ Project Structure

```text
NOOR-ED-SOCIETY/
│
├── assets/
│   └── images/
│
├── backend/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── dashboardController.js
│   │   ├── elearningController.js
│   │   ├── galleryController.js
│   │   ├── noticeController.js
│   │   └── scheduleController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── elearningUpload.js
│   │   ├── scheduleUpload.js
│   │   └── upload.js
│   │
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Elearning.js
│   │   ├── Gallery.js
│   │   ├── Notice.js
│   │   └── Schedule.js
│   │
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── elearningRoutes.js
│   │   ├── galleryRoutes.js
│   │   ├── noticeRoutes.js
│   │   └── scheduleRoutes.js
│   │
│   ├── uploads/
│   │
│   ├── createAdmin.js
│   ├── package.json
│   └── server.js
│
├── css/
│   ├── about.css
│   ├── admin-elearning.css
│   ├── admin-login.css
│   ├── animation.css
│   ├── contact.css
│   ├── dashboard.css
│   ├── elearning.css
│   ├── gallery-admin.css
│   ├── gallery.css
│   ├── home.css
│   ├── notice-admin.css
│   ├── notice.css
│   ├── responsive.css
│   ├── schedule-admin.css
│   ├── schedule.css
│   ├── style.css
│   └── variable.css
│
├── js/
│   ├── about.js
│   ├── admin-elearning.js
│   ├── admin-login.js
│   ├── contact.js
│   ├── dashboard.js
│   ├── elearning.js
│   ├── gallery-admin.js
│   ├── gallery.js
│   ├── home.js
│   ├── notice-admin.js
│   ├── notice.js
│   ├── schedule-admin.js
│   ├── schedule.js
│   └── script.js
│
├── about.html
├── admin-elearning.html
├── admin-login.html
├── contact.html
├── dashboard.html
├── elearning.html
├── gallery-admin.html
├── gallery.html
├── home.html
├── index.html
├── notice-admin.html
├── notice.html
├── schedule-admin.html
├── schedule.html
│
├── .gitignore
├── package.json
└── README.md