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

const getCommentById = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    //  console.log(commentId)
    if (!commentId) {
      throw new Error("Comment id required");
    }
    const result = await commentService.getCommentById(commentId as string);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      status: false,
      message: "Failed to get comment",
    });
  }
};

const getCommentByAuthorId = async (req: Request, res: Response) => {
  try {
    const { authorId } = req.params;
    //  console.log(commentId)
    if (!authorId) {
      throw new Error("author id required");
    }
    const result = await commentService.getCommentByAuthorId(
      authorId as string,
    );
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      status: false,
      message: "Failed to get comment",
    });
  }
};

export const commentController = {
  createComment,
  getCommentById,
  getCommentByAuthorId,
};
