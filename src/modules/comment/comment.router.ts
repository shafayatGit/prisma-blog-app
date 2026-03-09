import express from "express";
import { commentController } from "./comment.controller";

const router = express.Router();

router.post("/", commentController.createComment);

export default router;
