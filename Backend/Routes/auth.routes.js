import express from "express";
const router = express.Router();
import { profile } from "../Controllers/auth.controller.js";
import { signup, login, logout } from "../Controllers/auth.controller.js";
import { authMiddleware } from "../Middleware/auth.middleware.js";

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/profile", authMiddleware,profile);




export default router;
