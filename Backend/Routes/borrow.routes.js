import express from "express";
import {borrowBook,returnBook,getMyBorrowedBooks,getAllBorrowRecords,getStudentDashboard,} from "../Controllers/borrow.controller.js";
import { adminMiddleware, authMiddleware } from "../Middleware/auth.middleware.js";

const router = express.Router();

// student
router.post("/borrow", authMiddleware, borrowBook);
router.post("/return", authMiddleware, returnBook);
router.get("/my-books", authMiddleware, getMyBorrowedBooks);
router.get("/student/dashboard", authMiddleware, getStudentDashboard);
router.get("/admin/all", authMiddleware, adminMiddleware, getAllBorrowRecords);
export default router;