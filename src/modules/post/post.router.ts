import express from "express";
import { PostConteroller } from "./post.controller";

const router = express.Router();

router.post("/", PostConteroller.createPost);

export default router;
