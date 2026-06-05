const mongoose = require('mongoose');

const connectDB = async () => {
    console.log('[DB Step 1] Attempting to connect to MongoDB...');
    
    try {
        console.log('[DB Step 2] Fetching MongoDB URI from environment variables...');
        const uri = process.env.MONGO_URI;
        
        if (!uri) {
            console.error('[DB Error] MONGO_URI is missing in .env file!');
            console.log('[DB Failure] Cannot proceed without a database URI. Exiting.');
            process.exit(1);
        }

        console.log('[DB Step 3] URI found, initiating connection to MongoDB cluster...');
        const conn = await mongoose.connect(uri);

        console.log(`[DB Success] MongoDB Connected successfully: ${conn.connection.host}`);
    } catch (error) {
        console.error('[DB Error] Failed to connect to MongoDB. Details:', error.message);
        console.log('[DB Failure] Exiting process due to database connection failure.');
        process.exit(1);
    }
};

module.exports = connectDB;