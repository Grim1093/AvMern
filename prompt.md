# Task Master - Project Overview

## Main Goal
The main goal of the project is to build a full-stack Task Management Web Application (Task Master) using the MERN stack (MongoDB, Express.js, React.js, Node.js). It aims to provide users with a seamless, premium UI featuring a custom Sharp Sci-Fi Tactical HUD, Light/Dark mode themes, gamified elements, dynamic micro-animations, and glassmorphism styling built purely with Vanilla CSS.

## What is Done in the Project & Its Capabilities
The project is a fully functional web application with the following capabilities:
- **User Authentication**: Secure user registration and login using JSON Web Tokens (JWT) and bcryptjs for password hashing. Enforces strict backend validation.
- **Task Management (CRUD)**: Users can create, read, update, and delete their own tasks.
- **Task State Tracking**: Instant toggling of tasks between 'Pending' and 'Completed' states.
- **Gamification & Visual Urgency**: Features a dynamic daily progress bar and visually striking glows for tasks that are due soon (orange) or overdue (red). Includes custom colored pill-shaped badges for tags (Work, Personal, Urgent, Other).
- **Search, Filter & Pagination**: Advanced cross-referencing capabilities to search by title, filter by completion status, filter by tags, and efficient pagination for large data sets.
- **Premium UI/UX**: Designed using completely custom Vanilla CSS without template libraries. Includes striking CSS micro-animations, a responsive grid layout, SVG empty states, chamfered geometry, and a tactical design language.
- **Protected API Routes**: Backend middleware ensuring robust security so that users can only access and modify their own tasks.

## Database Structure
The application uses MongoDB via Mongoose, with two primary schemas:

### User Schema
- `name`: String (Required)
- `email`: String (Required, Unique, Regex Validated)
- `password`: String (Required, Minimum Length Validated)
- *timestamps*: true (createdAt, updatedAt)

### Task Schema
- `title`: String (Required)
- `description`: String (Optional)
- `tag`: String (Enum: ['Work', 'Personal', 'Urgent', 'Other'], Default: 'Other')
- `dueDate`: Date (Optional)
- `status`: String (Enum: ['pending', 'completed'], Default: 'pending')
- `userId`: ObjectId (Reference to 'User', Required)
- *timestamps*: true (createdAt, updatedAt)

## Folder Definitions
- `backend/`: Contains the Node.js and Express.js backend API source code.
  - `backend/config/`: Configuration files containing the logic to connect to the MongoDB database.
  - `backend/controllers/`: Contains the core handling and business logic for processing API requests for users and tasks.
  - `backend/middleware/`: Custom Express middleware, specifically the authentication guard verifying JWTs.
  - `backend/models/`: Mongoose schemas defining the data structure for the MongoDB collections.
  - `backend/routes/`: Express route definitions mapping the endpoints to their respective controller functions.
- `frontend/`: Contains the React.js application, bootstrapped with Vite.
  - `frontend/public/`: Static public assets such as favicons and global SVG icons that are served directly.
  - `frontend/src/`: The main source code directory for the React frontend application.
    - `frontend/src/assets/`: Media files including screenshots, logos, and vector illustrations used in the app.
    - `frontend/src/components/`: Reusable React components utilized across multiple views (e.g., custom Dropdowns).
    - `frontend/src/pages/`: React components representing the main viewable pages (Dashboard, Login, Register).

## File Definitions

### Root Level Files
- `.gitignore`: Specifies intentionally untracked files to ignore for Git version control in the root directory.
- `README.md`: The main project documentation explaining features, the tech stack, setup instructions, and evaluation criteria.
- `prompt.md`: Comprehensive project documentation containing the main goal, structure, capabilities, and the generative prompt instructions.

### Backend Files
- `backend/.env`: Defines environment variables including `PORT`, `MONGO_URI`, and `JWT_SECRET`.
- `backend/config/db.js`: Contains the `connectDB` function to establish an active connection to the MongoDB cluster utilizing Mongoose.
- `backend/controllers/taskController.js`: Defines logic for task-related operations, including retrieving (with search, filter, and pagination logic), creating, updating, and deleting task records.
- `backend/controllers/userController.js`: Defines the logic for handling user registration, login authentication, password hashing, and token generation.
- `backend/middleware/authMiddleware.js`: Implements the `protect` middleware function that verifies authorization headers and attaches the verified user to the request object.
- `backend/models/Task.js`: Defines the Mongoose schema and model for a `Task` document.
- `backend/models/User.js`: Defines the Mongoose schema and model for a `User` document.
- `backend/package.json`: Manages the backend project dependencies, scripts, and general metadata.
- `backend/package-lock.json`: Auto-generated lockfile for deterministic dependency resolution in the backend.
- `backend/routes/taskRoutes.js`: Maps task endpoints (e.g., `/api/tasks`) to the respective `taskController` functions, while wrapping them in the `protect` middleware.
- `backend/routes/userRoutes.js`: Maps user authentication endpoints (e.g., `/api/users/register`) to the respective `userController` functions.
- `backend/server.js`: The central entry point for the backend server that boots Express, sets up CORS and JSON middleware, mounts API routes, and connects to the database.

### Frontend Files
- `frontend/.gitignore`: Specifies intentionally untracked files for the Vite frontend project.
- `frontend/README.md`: Contains boilerplate instructions for the default Vite React application setup.
- `frontend/eslint.config.js`: Setup file for ESLint rules to maintain frontend code formatting and quality.
- `frontend/index.html`: The root HTML template file where the React application mounts itself.
- `frontend/package.json`: Manages the frontend project dependencies, configuration, and scripts.
- `frontend/package-lock.json`: Auto-generated lockfile for deterministic dependency resolution in the frontend.
- `frontend/public/favicon.svg`: Vector icon graphic used as the browser tab favicon.
- `frontend/public/icons.svg`: Publicly accessible SVG collection or sprite sheet.
- `frontend/src/App.css`: Specific stylistic definitions and basic layout wrappers for the root App component.
- `frontend/src/App.jsx`: The root React functional component establishing the React Router dom, theme toggling logic, and defining navigation paths.
- `frontend/src/assets/edit.png`: Preview image demonstrating the "Mission Briefing" edit task modal.
- `frontend/src/assets/hero.png`: Primary illustration or hero asset graphics.
- `frontend/src/assets/home.png`: Preview screenshot of the Tactical Dashboard in dark mode.
- `frontend/src/assets/homelight.png`: Preview screenshot of the Tactical Dashboard in light mode.
- `frontend/src/assets/login.png`: Preview screenshot of the secure authentication login screen.
- `frontend/src/assets/react.svg`: Static asset rendering the React logo.
- `frontend/src/assets/vite.svg`: Static asset rendering the Vite logo.
- `frontend/src/components/Dropdown.jsx`: Custom coded, fully accessible React select/dropdown component built for tag and status filtering.
- `frontend/src/index.css`: Extensive global stylesheet driving the application's unique Tactical Sci-Fi UI, managing CSS variables, animations, glassmorphism, tags, visual urgency glows, grids, and modal styles.
- `frontend/src/main.jsx`: The JavaScript entry file responsible for mounting the React `App` component onto the `index.html` root element inside a `StrictMode` wrapper.
- `frontend/src/pages/Dashboard.jsx`: The core interactive workspace for authenticated users allowing robust task CRUD functionality, searching, filtering, and displaying the gamified progress bar.
- `frontend/src/pages/Login.jsx`: A view component presenting the user login form interface and facilitating the local storage of JWT tokens upon successful authentication.
- `frontend/src/pages/Register.jsx`: A view component managing the registration flow to onboard new users into the platform.
- `frontend/vite.config.js`: Setup configuration dictating how the Vite build tool and development server operate.

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
│   │   │   ├── edit.png
│   │   │   ├── hero.png
│   │   │   ├── home.png
│   │   │   ├── homelight.png
│   │   │   ├── login.png
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
