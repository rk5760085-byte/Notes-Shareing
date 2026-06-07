# StudyShare - Notes Sharing Platform

StudyShare is an enterprise-grade Notes Sharing Platform built using the MERN stack (MongoDB, Express.js, React.js, Node.js). The application enables university and college students to upload lecture summaries, explore and search notes using multi-level filters, preview files directly, bookmark documents, and interact via discussion boards. It also includes a robust Admin dashboard for managing statistics, users, and moderating uploaded notes.

---

## 🚀 Key Features

### 👨‍🎓 Student Features
- **Authentication**: Email/password registration and login with JWT encryption and simulated password resets.
- **Notes Feed**: Advanced searching by title, subject, tags, or authors; filter by semester (Semester 1–8); sort by latest, downloads, or likes.
- **Actionable Details**: Toggle bookmarks, leave/delete comments, like/unlike notes, and download PDFs.
- **PDF Preview**: Real-time PDF content viewing via an embedded viewer.
- **Dashboard**: Track uploads count, downloads count, download history logs, bookmarked collections, and modify profile settings.

### 👑 Admin Features
- **Dashboard Metrics**: Interactive analytics card counters (Total Users, Total Notes, Total Downloads, Active Students).
- **Analytics Feeds**: Displays recent user signs and most popular note resources.
- **User Audits**: Lists all accounts on the platform with cascading user account deletions.
- **Content Moderation**: Moderate and delete inappropriate files across the platform.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS v3, React Router v6, Axios, Lucide React (Icons), Canvas-Confetti.
- **Backend**: Express.js, Node.js, Mongoose (MongoDB ODM), Multer (File Uploads), Bcrypt.js (Hashing), JWT.
- **Database**: MongoDB (Local or MongoDB Atlas).

---

## 📁 Project Structure

```text
/notes shareing
│
├── /backend
│   ├── /config          # Database connections config (db.js)
│   ├── /controllers     # Logic controllers (auth, note, user, admin)
│   ├── /middleware      # Auth protect, role check, and Multer file upload filters
│   ├── /models          # Mongoose database schemas (User, Note, Comment)
│   ├── /routes          # Express endpoints wiring (auth, notes, users, admin)
│   ├── /uploads         # PDF documents storage folder (served statically)
│   ├── server.js        # Entry server boots
│   └── package.json
│
└── /frontend
    ├── /src
    │   ├── /assets      # SVG logs and static UI media
    │   ├── /components  # Reusable elements (Navbar, Footer, NoteCard, Skeletons)
    │   ├── /context     # AuthContext session, ThemeContext (Dark/Light)
    │   ├── /pages       # Router pages (Home, Login, Signup, Catalog, Details, Dashboards)
    │   ├── /utils       # Axios request helper intercepts
    │   ├── App.jsx      # Root routing configurations
    │   └── main.jsx     # Bootstrap renders
    ├── tailwind.config.js
    └── package.json
```

---

## ⚙️ Environment Variables Setup

### Backend Environment Variables (`backend/.env`)
Create a file named `.env` inside the `backend` folder and populate it with:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/studyshare?retryWrites=true&w=majority
JWT_SECRET=your_super_jwt_secret_67890_abc
NODE_ENV=development
```
*(For local offline development, set `MONGO_URI=mongodb://127.0.0.1:27017/studyshare`)*

### Frontend Environment Variables (`frontend/.env`)
Create a file named `.env` inside the `frontend` folder:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📦 Installation & Getting Started

### Prerequisites
- Node.js installed (v18 or higher recommended).
- MongoDB database running locally or access to MongoDB Atlas.

### Step 1: Run the Backend
1. Open terminal in the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server in development mode:
   ```bash
   npm run dev
   ```
   *The API will be live at `http://localhost:5000`.*

### Step 2: Run the Frontend
1. Open a new terminal in the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite server:
   ```bash
   npm run dev
   ```
   *The client web application will be live at `http://localhost:5173`.*

---

## 🔌 API Documentation

All request bodies are JSON. Protected routes require `Authorization: Bearer <your_jwt_token>` header.

### 1. Authentication Endpoints
- **Register Account**
  - `POST /api/auth/register`
  - Body: `{ "name": "John Doe", "email": "john@uni.edu", "password": "password123" }`
  - Response: User details object + `"token": "JWT_STRING"`
- **Login Account**
  - `POST /api/auth/login`
  - Body: `{ "email": "john@uni.edu", "password": "password123" }`
  - Response: User details object + `"token": "JWT_STRING"`
- **Forgot Password (Simulation)**
  - `POST /api/auth/forgot-password`
  - Body: `{ "email": "john@uni.edu" }`
  - Response: `{ "message": "...", "resetToken": "TOKEN_STRING" }`
- **Reset Password (Simulation)**
  - `POST /api/auth/reset-password/:token`
  - Body: `{ "password": "newpassword123" }`
  - Response: `{ "message": "Password reset successful!" }`

### 2. Notes Endpoints
- **Explore & Filter Notes**
  - `GET /api/notes?search=term&semester=Semester%201&sort=downloads`
  - Response: Array of populated Note objects.
- **Upload Note (Multipart FormData)**
  - `POST /api/notes` (Protected)
  - Fields: `title`, `subject`, `semester`, `description`, `tags` (comma separated)
  - File: `pdf` (PDF document file)
  - Response: Created Note object.
- **Like Note Toggle**
  - `POST /api/notes/:id/like` (Protected)
  - Response: `{ "likes": [...], "likesCount": 2, "isLiked": true }`
- **Bookmark Note Toggle**
  - `POST /api/notes/:id/bookmark` (Protected)
  - Response: `{ "bookmarks": [...], "isBookmarked": true }`
- **Download PDF File**
  - `GET /api/notes/:id/download` (Protected)
  - Response: Binary stream file download (updates download counter).

### 3. Admin Endpoints
- **Get Dashboard Stats**
  - `GET /api/admin/stats` (Admin Only)
  - Response: `{ "totalUsers": 12, "totalNotes": 45, "totalDownloads": 120, "notesBySemester": [...], ... }`
- **Delete User Account**
  - `DELETE /api/admin/users/:id` (Admin Only)
  - Response: `{ "message": "User and all associated data deleted successfully" }`

---

## 🌐 Deployment Instructions

### 1. MongoDB Atlas Setup
1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database cluster and choose a free tier.
3. Click "Connect" -> "Connect your application". Copy the SRV connection URI.
4. Set database access credentials and network IP address access whitelist (e.g. `0.0.0.0/0` for cloud deployments).

### 2. Backend on Render
1. Create a free account on [Render](https://render.com/).
2. Click **New +** -> **Web Service** and connect your GitHub repository.
3. Set the following configurations:
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
4. Go to **Environment** tab and input:
   - `MONGO_URI` = *(your MongoDB Atlas connection string)*
   - `JWT_SECRET` = *(your production secret)*
   - `NODE_ENV` = `production`
5. Click deploy. Render will compile and serve the backend API.

### 3. Frontend on Vercel
1. Create a free account on [Vercel](https://vercel.com/).
2. Connect your GitHub repository.
3. Choose the project folder root and configure the project details:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Set Environment Variables:
   - `VITE_API_URL` = *(the URL of your deployed Render backend, e.g. `https://studyshare-api.onrender.com/api`)*
5. Click deploy. Your StudyShare frontend is now live!
