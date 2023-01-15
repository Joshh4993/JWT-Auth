import express from "express";
import { getUsers, Register, Login, Logout, getUser } from "../controllers/Users.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";

const userRouter = express.Router();

userRouter.get('/users', verifyToken, getUsers);
userRouter.post('/lookupuser', getUser);
userRouter.post('/users', Register);
userRouter.post('/login', Login);
userRouter.get('/token', refreshToken);
userRouter.delete('/logout', Logout);

export default userRouter;