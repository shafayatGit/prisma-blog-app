import { Request, Response } from "express";
import { commentService } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
  try {
    const result = await commentService.createComment();
    return result;
  } catch (error) {
    console.log(error);
  }
};
export const commentController = {
  createComment,
};
