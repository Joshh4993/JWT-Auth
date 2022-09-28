import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./config/Database.js";
import userRouter from "./routes/userRoutes.js";
import companyRouter from "./routes/companyRoutes.js";
dotenv.config()
const app = express();

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(cookieParser());
app.use(express.json());
app.use('/users', userRouter);
app.use('/companies/', companyRouter);

app.listen(5000, () => console.log(`Server running on port 5000`));