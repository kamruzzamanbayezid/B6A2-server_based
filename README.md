# Rental System Vehicle

**Live URL:** (https://b6-a2-backend-project.vercel.app/)

---

## Project Overview

Rental System for Vehicle is a full-featured vehicle rental management application that built with **Node.js, Express, PostgreSQL, and TypeScript**.  
In this application Admins can manage vehicles, users, and bookings, while customers can browse vehicles, make bookings, and cancel before the start date.

---

## Features

### User Management
- Register/Login with JWT authentication
- Role-based access control: Admin & Customer
- Admin can view/update/delete users
- Customers can delete their own profile (only if no active bookings exist)

### Vehicle Management
- Admin can create, update, and delete vehicles
- Vehicle availability updates automatically based on bookings

### Booking Management
- Customers/Admins can create bookings
- Customer can cancel booking before start date
- Auto-mark bookings as “returned” when the rental period ends
- Admin can mark bookings as returned

### System Features
- Auto-return scheduler using **node-cron**
- Validations for dates, status, and availability
- Error handling for active bookings, and authorization

---

## Technology Stack

- **Backend:** Node.js, Express, TypeScript  
- **Database:** PostgreSQL  
- **Authentication:** JWT  
- **Scheduler:** node-cron  
- **Database Client:** pg  
- **password hashing:** bcrypt  

---

## Setup & Usage

### 1. Clone the repository
```bash
git clone (https://github.com/kamruzzamanbayezid/B6A2-server_based.git)
cd B6A2-server_based
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
```bash
PORT=5000
DATABASE_URL=Your PostgreSQL connection string
JWT_SECRET=your_jwt_secret

```

### 3. Postman / API Testing
```bash
Base URL: http://localhost:5000/api/v1

```

