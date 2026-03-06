import { Request, Response } from "express";
import { postServices } from "./post.service";

const createPost = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(404).json({
      status: false,
      message: "Failed to create the post",
    });
  }
  try {
    const result = await postServices.createPost(req.body, req.user.id);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      status: false,
      message: "Failed to create the post",
    });
  }
};

export const PostConteroller = {
  createPost,
};
