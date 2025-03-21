const express = require("express");
const router = express.Router();
const ticketService = require("../services/ticketService");
const authenticateUser = require("../middleware/authenticateUser"); // Middleware to verify JWT
const checkManager = require("../middleware/checkManager"); // Middleware to check if user is a manager

// Submit Ticket Route
router.post("/submit-ticket", authenticateUser, async (req, res) => {
    const { amount, description } = req.body; // Extract amount and description from the request body

    // Input validation
    if (!amount || typeof amount !== "number") {
        return res.status(400).json({ message: "Invalid amount. It must be a number." });
    }
    if (!description || typeof description !== "string") {
        return res.status(400).json({ message: "Invalid description. It must be a string." });
    }

    // Create the ticket object
    const newTicket = {
        ticketId: generateUniqueId(), // Function to generate a unique ID for the ticket
        username: req.user.username,  
        amount,
        description,
        status: "Pending"               // Default status
    };

    try {
        await ticketService.createTicket(newTicket); // Save the ticket using the ticket service
        res.status(201).json({ message: "Ticket submitted successfully.", ticket: newTicket });
    } catch (error) {
        res.status(500).json({ message: "Error submitting ticket.", error: error.message });
    }
});

// Get Tickets by Status Route (for managers)
router.get("/tickets", authenticateUser, checkManager, async (req, res) => {
    const status = req.query.status; // Get the status from the query parameters
    
    try {
        const tickets = await ticketService.getTicketsByStatus(status); // Retrieve tickets based on status
        res.status(200).json(tickets); // Respond with the list of tickets
    } catch (error) {
        res.status(500).json({ message: "Error retrieving tickets.", error: error.message });
    }
});

// Get Pending Tickets Route (for managers)
router.get("/tickets/pending", authenticateUser, checkManager, async (req, res) => {
    try {
        const pendingTickets = await ticketService.getPendingTickets(); // Retrieve pending tickets
        res.status(200).json(pendingTickets);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving tickets.", error: error.message });
    }
});

// Approve or Deny Ticket Route
router.put("/tickets/:ticketId", authenticateUser, checkManager, async (req, res) => {
    const { ticketId } = req.params;
    const { action } = req.body; // action can be "approve" or "deny"

    if (!action || !["approve", "deny"].includes(action)) {
        return res.status(400).json({ message: "Invalid action. Use 'approve' or 'deny'." });
    }

    try {
        await ticketService.updateTicketStatus(ticketId, action === "approve" ? "Approved" : "Denied");
        res.status(200).json({ message: `Ticket ${action === "approve" ? "approved" : "denied"} successfully.` });
    } catch (error) {
        res.status(500).json({ message: "Error processing ticket.", error: error.message });
    }
});

// View Previous Tickets Route
router.get("/tickets/my-tickets", authenticateUser, async (req, res) => {
    const username = req.user.username; // Use the authenticated user's username

    try {
        const tickets = await ticketService.getTicketsByUsername(username); // Retrieve tickets for the user
        res.status(200).json(tickets); // Respond with the list of tickets
    } catch (error) {
        res.status(500).json({ message: "Error retrieving tickets.", error: error.message });
    }
});

// Helper function to generate a unique ticket ID
const generateUniqueId = () => {
    return `ticket_${Date.now()}`;
};

module.exports = router; // Export the router
