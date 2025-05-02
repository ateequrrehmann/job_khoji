import express from 'express';
import cookieParser from 'cookie-parser';   //we access the data in of frontend in backend
import cors from 'cors';   //cross-origin resource sharing
import dotenv from 'dotenv';  //to access the environment variables
import connectDB from './utils/db.js';
dotenv.config({});

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:5173',  //for frontend
    credentials: true
}

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
})