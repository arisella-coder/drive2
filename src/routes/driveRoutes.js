import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { downloadFile, listFiles } from "../controllers/driveController.js";

const router = express.Router();

router.get("/list", authMiddleware, listFiles);
router.get("/download/:driveType/:fileId",authMiddleware, downloadFile);

export default router;
