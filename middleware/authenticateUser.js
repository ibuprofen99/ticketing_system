const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided." });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error("Token verification error:", err);
            return res.status(401).json({ message: "Failed to authenticate token." });
        }

        req.user = decoded; // Attach decoded user info to the request object
        next(); 
    });
};

module.exports = authenticateUser; // Export the middleware
