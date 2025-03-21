const ticketRepository = require("../repositories/ticketRepository"); // Import the ticket repository

const TicketService = {
    // Create a new ticket
    async createTicket(ticket) {
        return await ticketRepository.createTicket(ticket);
    },

    // Retrieve all pending tickets
    async getPendingTickets() {
        return await ticketRepository.getPendingTickets();
    },
    // Retrieve tickets by username
    async getTicketsByUsername(username) {
        return await ticketRepository.getTicketsByUsername(username); // Call the repository method
    },
    // Retrieve tickets by status
    async getTicketsByStatus(status) {
        return await ticketRepository.getTicketsByStatus(status); // Call the repository method
    },
    // Update the status of a ticket
    async updateTicketStatus(ticketId, status) {
        return await ticketRepository.updateTicketStatus(ticketId, status);
    }
    
};


module.exports = TicketService; // Export the TicketService for use in the controller
