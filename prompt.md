# Task Master - Project Overview

## Main Goal
The main goal of the project is to build a full-stack Task Management Web Application (Task Master) using the MERN stack (MongoDB, Express.js, React.js, Node.js). It provides users with a seamless, premium UI with a glassmorphism aesthetic, enabling them to register, log in, and effectively manage their daily tasks with advanced state tracking, searching, filtering, and pagination capabilities.

## What is Done in the Project & Its Capabilities
The project is a fully functional web application with the following capabilities:
- **User Authentication**: Secure user registration and login using JSON Web Tokens (JWT) and bcrypt for password hashing.
- **Task Management (CRUD)**: Users can create, read, update, and delete their own tasks.
- **Task State Tracking**: Tasks can be toggled instantly between 'Pending' and 'Completed' states.
- **Search & Filter**: Real-time searching of tasks by title and filtering by completion status.
- **Pagination**: Breaking down lists of tasks to handle large datasets effectively.
- **Premium UI/UX**: Designed using Vanilla CSS (no component libraries) with dark mode, frosted glass elements, and smooth interactions/animations.
- **Protected API Routes**: Backend middleware ensures users can only access and modify their own tasks.

## Database Structure
The application uses MongoDB via Mongoose, with two primary schemas:

### User Schema
- `name`: String (Required)
- `email`: String (Required, Unique)
- `password`: String (Required, Hashed)
- *timestamps*: true (createdAt, updatedAt)

### Task Schema
- `title`: String (Required)
- `description`: String (Optional)
- `status`: String (Enum: ['pending', 'completed'], Default: 'pending')
- `userId`: ObjectId (Reference to 'User', Required)
- *timestamps*: true (createdAt, updatedAt)

## Folder Definitions
- `backend/`: Contains the Node.js and Express.js backend API source code.
  - `backend/config/`: Configuration files, such as database connection setup.
  - `backend/controllers/`: Contains the core logic for handling API requests and business logic for tasks and users.
  - `backend/middleware/`: Custom Express middleware, such as the authentication guard (`authMiddleware.js`).
  - `backend/models/`: Mongoose schemas defining the data structure for MongoDB.
  - `backend/routes/`: Express route definitions that map API endpoints to their respective controllers.
- `frontend/`: Contains the React.js frontend application, bootstrapped with Vite.
  - `frontend/public/`: Static assets like favicons that don't need processing by the bundler.
  - `frontend/src/`: The main source code for the React frontend application.
    - `frontend/src/assets/`: Media and image assets used within the application.
    - `frontend/src/components/`: Reusable React components used across multiple pages (e.g., custom Dropdown component).
    - `frontend/src/pages/`: React components representing entire views or pages (Login, Register, Dashboard).

## File Definitions

### Root Level Files
- `.gitignore`: Specifies intentionally untracked files to ignore for Git version control.
- `README.md`: The main project documentation explaining features, tech stack, and setup instructions.
- `prompt.md`: Project documentation containing its main goal, structure, what is done, capabilities and prompt.

### Backend Files
- `backend/.env`: Environment variables including `PORT`, `MONGO_URI`, and `JWT_SECRET`.
- `backend/config/db.js`: Contains the `connectDB` function to establish a connection to the MongoDB cluster using Mongoose.
- `backend/controllers/taskController.js`: Defines logic for task-related API requests, including fetching (with search/filter/pagination), creating, updating, and deleting tasks.
- `backend/controllers/userController.js`: Defines logic for user authentication, password hashing, and JWT generation during registration and login.
- `backend/middleware/authMiddleware.js`: Contains the `protect` middleware to verify incoming JWT tokens and attach the authenticated user to the request object.
- `backend/models/Task.js`: Defines the Mongoose schema for a Task.
- `backend/models/User.js`: Defines the Mongoose schema for a User.
- `backend/package.json`: Manages backend dependencies, scripts, and metadata.
- `backend/package-lock.json`: Locks dependency versions for deterministic backend installs.
- `backend/routes/taskRoutes.js`: Maps task API endpoints (`/api/tasks`) to controller functions, applying the auth middleware for protection.
- `backend/routes/userRoutes.js`: Maps user API endpoints (`/api/users/register`, `/api/users/login`) to controller functions.
- `backend/server.js`: The entry point for the backend server, setting up Express, middleware, routes, and connecting to the database.

### Frontend Files
- `frontend/.gitignore`: Specifies untracked files for the frontend project.
- `frontend/README.md`: Boilerplate README for the Vite React app.
- `frontend/eslint.config.js`: ESLint configuration for linting frontend code.
- `frontend/index.html`: The main HTML template where the React app is injected.
- `frontend/package.json`: Manages frontend dependencies, scripts, and metadata.
- `frontend/package-lock.json`: Locks dependency versions for deterministic frontend installs.
- `frontend/public/favicon.svg` & `frontend/public/icons.svg`: Public static icon files.
- `frontend/src/App.css`: Specific styles for the main App component and basic layout.
- `frontend/src/App.jsx`: The root App component setting up React Router and defining navigation paths.
- `frontend/src/assets/hero.png`, `react.svg`, `vite.svg`: Static visual assets for the frontend.
- `frontend/src/components/Dropdown.jsx`: A custom React dropdown component for selecting filter options.
- `frontend/src/index.css`: Global stylesheet defining CSS variables, glassmorphism utilities, layout styling, inputs, buttons, and animations.
- `frontend/src/main.jsx`: The React entry point, wrapping `App` in `React.StrictMode` and rendering it to the DOM.
- `frontend/src/pages/Dashboard.jsx`: The main authenticated view for displaying, adding, editing, deleting tasks, along with search, filter, and pagination UI.
- `frontend/src/pages/Login.jsx`: Component for the user login form and authentication flow.
- `frontend/src/pages/Register.jsx`: Component for new user registration form and flow.
- `frontend/vite.config.js`: Configuration for the Vite development server and bundler.

## Complete Project File and Folder Tree
```text
.
├── .gitignore
├── README.md
├── backend
│   ├── .env
│   ├── config
│   │   └── db.js
│   ├── controllers
│   │   ├── taskController.js
│   │   └── userController.js
│   ├── middleware
│   │   └── authMiddleware.js
│   ├── models
│   │   ├── Task.js
│   │   └── User.js
│   ├── package-lock.json
│   ├── package.json
│   ├── routes
│   │   ├── taskRoutes.js
│   │   └── userRoutes.js
│   └── server.js
├── frontend
│   ├── .gitignore
│   ├── README.md
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── assets
│   │   │   ├── hero.png
│   │   │   ├── react.svg
│   │   │   └── vite.svg
│   │   ├── components
│   │   │   └── Dropdown.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── pages
│   │       ├── Dashboard.jsx
│   │       ├── Login.jsx
│   │       └── Register.jsx
│   └── vite.config.js
└── prompt.md
```

update prompt.md file in root folder containing everything, our main goal, complete project structure in detail including every file and folder (except node_modules), what is done in the project and what can it do, its capabilities and first read every file then define each file in detail about what it does and define each folder about what it does and database structure and a complete project file and folder tree and in the end of the file copy this prompt and do not copy anything beyond this line