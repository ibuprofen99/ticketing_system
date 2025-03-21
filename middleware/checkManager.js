const checkManager = (req, res, next) => {
    if (!req.user || req.user.role !== "manager") {
        return res.status(403).json({ message: "Access denied. Managers only." });
    }
    next(); // Proceed to the next middleware or route handler
};

module.exports = checkManager; // Export the middleware
