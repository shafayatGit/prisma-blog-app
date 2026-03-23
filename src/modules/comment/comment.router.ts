import express from "express";
import { commentController } from "./comment.controller";
import { auth, UserRole } from "../../middleware/auth";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  commentController.createComment,
);
router.get(
  "/:commentId",
  auth(UserRole.USER, UserRole.ADMIN),
  commentController.getCommentById,
);
router.get(
  "/author/:authorId",
  auth(UserRole.USER, UserRole.ADMIN),
  commentController.getCommentByAuthorId,
);
router.delete(
  "/:commentId",
  auth(UserRole.USER, UserRole.ADMIN),
  commentController.deleteComment,
);
router.patch(
  "/:commentId",
  auth(UserRole.USER, UserRole.ADMIN),
  commentController.updateComment,
);

export default router;
