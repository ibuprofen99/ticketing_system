const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();

const TicketRepository = {
    // Create a new ticket
    async createTicket(ticket) {
        const params = {
            TableName: "Tickets", 
            Item: ticket
        };
        await db.put(params).promise(); // Save the ticket in DynamoDB
    },

    // Retrieve all pending tickets
    async getPendingTickets() {
        const params = {
            TableName: "Tickets",
            FilterExpression: "#status = :status",
            ExpressionAttributeNames: {
                "#status": "status"
            },
            ExpressionAttributeValues: {
                ":status": "Pending" // Value to filter by
            }
        };
        const result = await db.scan(params).promise();
        return result.Items || []; // Return an array of pending tickets
    },
    async getTicketsByUsername(username) {
        const params = {
            TableName: "Tickets",
            FilterExpression: "username = :username",
            ExpressionAttributeValues: {
                ":username": username
            }
        };
        const result = await db.scan(params).promise(); // Scan the table for matching tickets
        return result.Items || []; // Return the tickets or an empty array if none found
    },
    async getTicketsByStatus(status) {
        const params = {
            TableName: "Tickets", // Change to your DynamoDB table name
        };

        // If a status is provided, filter tickets by status
        if (status) {
            params.FilterExpression = "#status = :status";
            params.ExpressionAttributeNames = {
                "#status": "status" // Use alias for the reserved keyword
            };
            params.ExpressionAttributeValues = {
                ":status": status // Value to filter by
            };
        }

        const result = await db.scan(params).promise(); // Scan the table for matching tickets
        return result.Items || []; // Return the tickets or an empty array if none found
    },
    // Update the status of a ticket
    async updateTicketStatus(ticketId, status) {
        const params = {
            TableName: "Tickets",
            Key: { ticketId },
            UpdateExpression: "set #status = :status",
            ExpressionAttributeNames: {
                "#status": "status"
            },
            ExpressionAttributeValues: {
                ":status": status
            }
        };
        await db.update(params).promise(); 
    }
};

module.exports = TicketRepository; // Export the TicketRepository for use in the service
