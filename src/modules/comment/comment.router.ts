import express from "express";
import { commentController } from "./comment.controller";
import { auth, UserRole } from "../../middleware/auth";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  commentController.createComment,
);

export default router;
