import express from "express";
import { getProjects, getProject, createProject } from "../controllers/Projects.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const projectRouter = express.Router();

projectRouter.get('/projects', verifyToken, getProjects);
projectRouter.get('/project', getProject);
projectRouter.post('/project', createProject);

export default projectRouter;