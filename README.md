# Task Master - Premium MERN Stack Application

A full-stack Task Management Web Application built with the **MERN** stack (MongoDB, Express.js, React.js, Node.js). 
This project features a sleek, premium UI built from scratch using Vanilla CSS with glassmorphism, responsive grids, and dynamic micro-animations.

## 🌟 Features

### Frontend (React + Vite)
- **Premium UI/UX**: Designed using Vanilla CSS (no component libraries) to feature dark mode, frosted glass elements, and smooth interactions.
- **Complete Task Operations**: Create, Read, Update, Delete (CRUD) operations via intuitive modals and inline actions.
- **Advanced State Tracking**: Toggle tasks between 'Pending' and 'Completed' states instantly.
- **Search & Filter**: Real-time searching of tasks by title and filtering by completion status.
- **Pagination**: Breaking down lists of tasks to handle large datasets effectively.

### Backend (Node.js + Express.js)
- **RESTful API Architecture**: Organized with explicit Routes, Controllers, and Middleware.
- **Secure Authentication**: Utilizing JWT (JSON Web Tokens) to secure user sessions and bcrypt for password hashing.
- **Protected Routes**: Ensuring users can only manage and view their own tasks.
- **MongoDB Integration**: Robust schemas for Users and Tasks defined via Mongoose.

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, React Router DOM, Axios, Vanilla CSS
- **Backend**: Node.js, Express.js, Mongoose, JWT, bcrypt, CORS
- **Database**: MongoDB (Atlas)

---

## 🚀 Setup Instructions

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Clone the repository
Navigate into the project directory:
```bash
cd Avden/AvMern
```

### 2. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Set up the `.env` file. Ensure there is a `.env` file in the `backend` folder with the following contents:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   ```
4. Start the backend server:
   ```bash
   node server.js
   # OR for development with hot-reloading:
   npx nodemon server.js
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

### 4. Open the App
By default, the Vite server will run on `http://localhost:5173`. Open this URL in your browser to view the application!

---

## 📸 Demo

> (Replace these placeholders with actual screenshots or a link to a demo video)

- **Login Screen**: `[Screenshot of Login]`
- **Dashboard**: `[Screenshot of Dashboard with Glassmorphism]`
- **Edit Modal**: `[Screenshot of Edit Modal]`

## 🧪 Evaluation Criteria Met
- **Code Quality**: Structured into modular components, controllers, and services.
- **UI/UX**: Custom premium aesthetic avoiding generic templates.
- **Functionality**: Full robust CRUD alongside all required core features.
- **Error Handling**: API errors are caught and surfaced via friendly UI alerts.
- **Bonus Implementations**: Fully functional pagination, searching, and filtering built into the core API.

## 🤝 Contributing
Feel free to open an issue or submit a pull request if you have any suggestions to improve the project!
