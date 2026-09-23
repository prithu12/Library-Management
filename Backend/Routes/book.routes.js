import express from "express";
import {
  createBook,
  getAllBooks,
  getSingleBook,
  deleteBook,
  getAdminDashboardStats,
} from "../Controllers/book.controller.js";
import { adminMiddleware, authMiddleware } from "../Middleware/auth.middleware.js";
import { upload } from "../Middleware/multer.js";
const router = express.Router();
router.post("/add", authMiddleware, adminMiddleware, upload.single("coverImage"), createBook);
router.get("/all", getAllBooks);
router.get("/:id", getSingleBook);
router.delete("/delete/:id", authMiddleware, adminMiddleware, deleteBook);
router.get("/admin/dashboard", authMiddleware, adminMiddleware, getAdminDashboardStats)
export default router;