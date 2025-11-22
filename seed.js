const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/userModel');
const connectDB = require('./src/config/db');

dotenv.config();
connectDB();

const importData = async () => {
    try {
        await User.deleteMany();

        const users = [
            {
                name: 'Alice Admin',
                email: 'alice@example.com',
                password: 'password123',
                isVerified: true,
            },
            {
                name: 'Bob User',
                email: 'bob@example.com',
                password: 'password123',
                isVerified: true,
            },
            {
                name: 'Charlie Guest',
                email: 'charlie@example.com',
                password: 'password123',
                isVerified: true,
            },
        ];

        await User.create(users);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
