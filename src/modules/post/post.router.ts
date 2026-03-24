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

router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  PostConteroller.createPost,
);

export default router;
