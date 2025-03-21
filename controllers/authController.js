const express = require("express");
const authService = require("../services/authService");
const router = express.Router();
const checkManager = require("../middleware/checkManager"); // Middleware to check if user is a manager
const authenticateUser = require("../middleware/authenticateUser"); // Middleware to verify JWT


// Import necessary modules and dependencies
const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const USERS_TABLE = "Users";

const jwt = require("jsonwebtoken");

// Change User Role Route
router.put("/change-role", authenticateUser, checkManager, async (req, res) => {
    const { username, newRole } = req.body; // Extract username and new role from the request body
    // Check if the user is a manager

    // Validate input
    if (!username || !newRole || !["employee", "manager"].includes(newRole)) {
        return res.status(400).json({ message: "Invalid input. Provide a username and a valid role." });
    }

    // Get the current user data
    const userData = await dynamoDB.get({
        TableName: USERS_TABLE,
        Key: { username }
    }).promise();

    if (!userData.Item) {
        return res.status(404).json({ message: "User not found." });
    }

    // Update the user's role
    await dynamoDB.update({
        TableName: USERS_TABLE,
        Key: { username },
        UpdateExpression: "set #role = :role",
        ExpressionAttributeNames: { "#role": "role" },
        ExpressionAttributeValues: { ":role": newRole }
    }).promise();

    res.status(200).json({ message: `${username} role's changed to ${newRole}.` });
});


// Registration Route
router.post("/register", async (req, res) => {
    const { username, password } = req.body; // Extract username and password from the request body

    try {
        const newUser = await authService.registerUser(username, password); // Call the registerUser function from authService
        res.status(201).json(newUser); // Respond with the created user and a 201 status code
    } catch (error) {
        res.status(400).json({ message: error.message }); // Respond with an error message and a 400 status code
    }
});

// Login Route
router.post("/login", async (req, res) => {
    const { username, password } = req.body; // Extract username and password from the request body

    try {
        const {token, role} = await authService.loginUser(username, password); // Call the loginUser function from authService
        res.status(200).json({ token, username, role }); // Respond with the token and a 200 status code
    } catch (error) {
        res.status(401).json({ message: error.message }); // Respond with an error message and a 401 status code
    }
});

module.exports = router; // Export the router for use in index.js
