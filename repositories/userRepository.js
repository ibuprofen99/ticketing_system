const AWS = require("aws-sdk");

// Set the region
AWS.config.update({ region: "us-west-1" }); // Change to your region

const db = new AWS.DynamoDB.DocumentClient();

const UserRepository = {
    // Get user by username
    async getUserByUsername(username) {
        const params = {
            TableName: "Users",
            Key: { username }
        };
        const result = await db.get(params).promise();
        return result.Item || null; // Return the user if found, else null
    },

    // Create a new user
    async createUser(user) {
        const params = {
            TableName: "Users",
            Item: user // The user object to be saved
        };
        await db.put(params).promise(); // Save the user in DynamoDB
        return user; // Return the created user
    }
};

module.exports = UserRepository; // Export the UserRepository for use in services
