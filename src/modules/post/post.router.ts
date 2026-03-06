import express from "express";
import { auth, UserRole } from "../../middleware/auth";
import { PostConteroller } from "./post.controller";

const router = express.Router();
router.get("/",PostConteroller.getAllPosts)
router.post("/", auth(UserRole.USER), PostConteroller.createPost);

export default router;
