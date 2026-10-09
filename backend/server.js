
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import bookRoutes from "./routes/bookRoutes.js";

dotenv.config();

const app = express();

// --------------------
// Middleware
// --------------------

// Allow React frontend to connect
app.use(cors());

// Read JSON data from React
app.use(express.json());

// Read form data if needed
app.use(express.urlencoded({ extended: true }));

// --------------------
// Routes
// --------------------

app.use("/api/books", bookRoutes);

// --------------------
// Test Route
// --------------------

app.get("/", (req, res) => {
  res.send("Library Management API is running");
});

// --------------------
// MongoDB Connection
// --------------------

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    // --------------------
    // Start Server
    // --------------------

    app.listen(5000, () => {
      console.log("Server running at http://localhost:5000");
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });




  //folder-lms_react_express
  //lms_react_express- backend/server
  //terminal-cd backend
  //npm init -y, npm i express cors mongoose dotenv
  //backend-models folder-Book.js file-yesterdays Book.js code copy paste
  //backend-routes folder-bookRoutes.js file-yesterdays bookRoutes.js code copy paste
  //.env file- yesterdays code copy paste
  //server.js

  //lms-react-express frontend/client
  //terminal- cd frontend
  //npm create vite@latest .
  
