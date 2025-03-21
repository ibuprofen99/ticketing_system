const express = require("express");
const bodyParser = require("body-parser");
const authController = require("./controllers/authController");
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = 3000;
// Middleware to parse request bodies
//console.log(process.env.JWT_SECRET);
// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Use the authentication controller for routes
app.use("/api/auth", authController);
app.use("/api", require("./controllers/ticketController")); // Use the ticket controller for ticket-related routes
// Health check route (optional)
app.get("/", (req, res) => {
    res.send("Reimbursement System API is running!");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
