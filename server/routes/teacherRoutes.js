// routes/teacherRoutes.js
import express from "express";
import { TeacherLogin } from "../controllers/login.js";
import { getPolls } from "../controllers/poll.js";

const router = express.Router();

// Teacher login route
router.post("/teacher-login", TeacherLogin);

// Get polls for a teacher
router.get("/polls/:teacherUsername", getPolls);

export default router;
