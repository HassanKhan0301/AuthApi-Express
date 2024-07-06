import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './config/connectdb.js'
import userRoute  from './routes/userRoute.js'


const app= express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;
connectDB(DATABASE_URL)

app.use("/api/user",userRoute)

app.listen(port,()=>{
    console.log(`Server Listening at http://localhost:${port}`);
})