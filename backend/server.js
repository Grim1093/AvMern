console.log('[Server Step 1] Starting server initialization...');

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

console.log('[Server Step 2] Modules imported successfully.');

// Load environment variables
dotenv.config();
console.log('[Server Step 3] Environment variables loaded.');

// Initialize express app
const app = express();
console.log('[Server Step 4] Express application initialized.');

// Connect to Database
connectDB();

// Middleware
console.log('[Server Step 5] Setting up middleware...');
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://av-mern.vercel.app/"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);
app.use(express.json());
console.log('[Server Step 6] Middleware configured (CORS and JSON parser).');

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Task Master API is running"
  });
});

app.listen(PORT, () => {
    console.log(`[Server Success] Server is actively listening on port ${PORT}`);
});
