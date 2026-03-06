import express from "express";
import { PostConteroller } from "./post.controller";
import { auth, UserRole } from "../../middleware/auth";

const router = express.Router();

router.post("/", auth(UserRole.USER), PostConteroller.createPost);

export default router;
