import express from "express";
import { auth, UserRole } from "../../middleware/auth";
import { PostConteroller } from "./post.controller";

const router = express.Router();
router.get("/", PostConteroller.getAllPosts);

router.get(
  "/my-posts",
  auth(UserRole.USER, UserRole.ADMIN),
  PostConteroller.getMyAllPost,
);

router.get("/:postId", PostConteroller.getPostById);

router.get("/stats/all", auth(UserRole.ADMIN), PostConteroller.getPostStats);

router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  PostConteroller.createPost,
);

router.patch(
  "/:postId/my-posts",
  auth(UserRole.USER, UserRole.ADMIN),
  PostConteroller.updateMyPost,
);

router.delete(
  "/:postId/my-posts",
  auth(UserRole.USER, UserRole.ADMIN),
  PostConteroller.deletePost,
);

export default router;
