import express from "express";
import { TeacherLogin } from "../controllers/loginController.js";
import { getPolls } from "../controllers/pollController.js";

const router = express.Router();

router.post("/teacher-login", TeacherLogin);

router.get("/polls/:teacherUsername", getPolls);

export default router;
