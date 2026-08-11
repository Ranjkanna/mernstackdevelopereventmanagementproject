# Elite & Prestige Hall — Event Management System

A full-stack **MERN** (MongoDB, Express, React, Node.js) web application for planning and managing event bookings — built as a portfolio project to demonstrate end-to-end web development skills.

## About the Project

Elite & Prestige Hall lets users browse event packages, book venues, and track their bookings, while admins manage events, view bookings on an interactive map, and update statuses — all through role-based dashboards.

## Features

- User registration/login with JWT authentication and role-based access (Admin/User)
- Interactive booking form with venue selection and map-based location pinning (Leaflet + OpenStreetMap)
- Admin dashboard to manage events, bookings, and view all bookings on a calendar map
- Auto-calculated booking status (upcoming/completed/cancelled)
- Booking cancellation without losing records
- Responsive design with a custom purple-and-blue themed dashboard

## Tech Stack

**Frontend:** React, Vite, React Router, Bootstrap, React-Bootstrap, Leaflet, Axios
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Multer

## Project Structure
├── src/ # Frontend (React) source code
├── public/ # Frontend static assets
├── server/ # Backend (Node/Express) source code


## Getting Started

### Frontend

npm install
npm run dev


### Backend

cd server
npm install
npm run dev


Create a `.env` file in the `server` folder with your own MongoDB URI and JWT secret.

## Author

**Ranchani** — [GitHub](https://github.com/Ranjkanna) | [LinkedIn](https://linkedin.com/in/siva-ranchani-17ba9139b)
