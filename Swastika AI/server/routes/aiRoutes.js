import { aiCall } from "../controllers/aiController.js";
import express from "express"

const router = express.Router();

router.post("/chat",aiCall)

export default router;