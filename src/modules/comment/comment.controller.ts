import { Request, Response } from "express";
import { commentService } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
  try {
    //Taking authorId from the user who is loggedIn
    req.body.authorId = req.user?.id;

    const result = await commentService.createComment(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      status: false,
      message: "Failed to create comment",
    });
  }
};
export const commentController = {
  createComment,
};
