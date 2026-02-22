import { Request, Response } from "express";
import { postServices } from "./post.service";

const createPost = async (req: Request, res: Response) => {
  try {
    const result = await postServices.createPost(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: false,
      message: "Failed to create post",
    });
  }
};

export const PostConteroller = {
  createPost,
};
