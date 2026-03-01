# SediaBanjir 
Flood Alert Assistant

SediaBanjir is a web based flood preparedness platform designed to help Malaysian communities understand flood risks and take early preventive action. The system combines structured risk evaluation with AI generated advisory insights to provide clear and actionable safety guidance.

---

## Live Demo

Deployed Application:  
https://sedia-banjir-frontend.vercel.app/

---

## Features

- Google Sign In authentication using Firebase  
- Location based flood risk checking  
- Risk classification display with water level metrics  
- AI generated flood advisory using Google Gemini  
- Modular frontend and backend architecture  

---

## Tech Stack

### Frontend
- React with Vite  
- TypeScript  
- Firebase Authentication  
- Deployed on Vercel  

### Backend
- Node.js  
- Express API  
- Deployed on Render  
- Gemini API integration  

### Google Technologies
- Firebase Authentication  
- Google AI Studio  
- Gemini API  

---

## Project Structure

**Frontend**  
Handles user interface, authentication, and API communication.

**Backend**  
Handles risk logic, Gemini prompt construction, AI response formatting, and secure API communication.

---

## 🚀 How to Run Locally

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/JnnhCloud/SediaBanjir-Flood-Alert-Assistant.git
cd SediaBanjir-Flood-Alert-Assistant\frontend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Create a `.env` File

Create a `.env` file in the root directory and add:

```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_BACKEND_URL=http://localhost:8080
```

Make sure Firebase Authentication is configured in your Firebase project (Google Sign-In enabled).

### 4️⃣ Start Development Server

```bash
npm run dev
```

---

## 🖥 Backend Setup

Navigate into backend folder:

```bash
cd SediaBanjir-Flood-Alert-Assistant\backend
```

### 1️⃣ Install Dependencies

```bash
npm install
```

### 2️⃣ Create Backend `.env` File

```env
GEMINI_API_KEY=your_gemini_key
PORT=8080
```

### 3️⃣ Start Backend Server

```bash
node server.js
```

---
The backend API will now run on http://localhost:8080 and connect with the frontend.

## 🌍 Deployment

### Frontend
- Deployed using **Vercel**
- Configure environment variables in:  
  **Project Settings → Environment Variables**

### Backend
- Deployed on **Render**
- Environment variables are securely configured on the Render dashboard

---

## 🎯 Sustainable Development Goals

- **SDG 11** – Sustainable Cities and Communities  
- **SDG 13** – Climate Action  

---

## 👨‍💻 Author

Crocohack for Kitahack 2026.
