import express from "express";
import {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
} from "../Controllers/admin.controller.js";
import { adminMiddleware, authMiddleware } from "../Middleware/auth.middleware.js";

const router = express.Router();

router.get("/students", authMiddleware, adminMiddleware, getAllStudents);
router.get("/students/:id", authMiddleware, adminMiddleware, getSingleStudent);
router.delete("/students/:id", authMiddleware, adminMiddleware, deleteStudent);

export default router;