import express from "express";
import { getToken, getTokens, createToken } from "../controllers/SpecialTokens.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const specialTokenRouter = express.Router();

specialTokenRouter.get('/tokens', verifyToken, getTokens);
specialTokenRouter.post('/lookuptoken', getToken);
specialTokenRouter.post('/token', createToken);

export default specialTokenRouter;