const bcrypt = require("bcryptjs");
const userRepository = require("../repositories/userRepository");
const jwt = require("jsonwebtoken");
require('dotenv').config();


// Secret key for JWT token
const JWT_SECRET = process.env.JWT_SECRET;
//console.log(JWT_SECRET);

// Register a new user
const registerUser = async (username, password) => {
    // Check if the user already exists
    const existingUser = await userRepository.getUserByUsername(username);
    if (existingUser) {
        throw new Error("Username already exists.");
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username, password: hashedPassword, role: "employee" };

    // Save the new user in the repository
    return await userRepository.createUser(newUser);
};

// Login a user
const loginUser = async (username, password) => {
    // Get the user from the repository
    const user = await userRepository.getUserByUsername(username);
    if (!user) {
        throw new Error("Invalid username or password.");
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid username or password.");
    }

    // Generate a JWT token
    const token = jwt.sign({ username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
    return { token, username: user.username, role: user.role }; 
};

module.exports = {
    registerUser,
    loginUser,
};
