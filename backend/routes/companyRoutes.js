import express from "express";
import { getCompanies, getCompany, createCompany } from "../controllers/Companies.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const companyRouter = express.Router();

companyRouter.get('/companies', verifyToken, getCompanies);
companyRouter.get('/company', getCompany);
companyRouter.post('/company', createCompany);

export default companyRouter;