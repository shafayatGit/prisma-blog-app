import { Request, Response } from "express";
import { postServices } from "./post.service";
import { boolean } from "better-auth";

const createPost = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(404).json({
      status: false,
      message: "Failed to create the post",
    });
  }
  try {
    const result = await postServices.createPost(
      req.body,
      req.user.id as string,
    );
    res.status(200).json({
      message: "Post created",
      data: result,
      user: req.user,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      status: false,
      message: "Failed to create the post",
    });
  }
};

const getAllPosts = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : undefined;

    //searching by multiple value
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

    //searching by isFeatured
    const isFeatured = req.query.isFeatured ? req.query.isFeatured === "true" : undefined

    const result = await postServices.getAllPosts({
      search: searchString,
      tags,
      isFeatured
    });
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: false,
      message: "Failed to get all posts",
    });
  }
};

export const PostConteroller = {
  createPost,
  getAllPosts,
};
