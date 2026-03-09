import { Request, Response } from "express";
import { postServices } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";

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
    //! Pagination
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const skip = (page - 1) * limit;

    //! Sorting
    const sortBy = req.query.sortBy as string | undefined;
    const sortOrder = req.query.sortOrder as string | undefined;

    //!Searching
    // taking from the query
    const { search } = req.query;
    const { status } = req.query;

    // typeHandling
    const searchString = typeof search === "string" ? search : undefined;
    const statusType = status as PostStatus | undefined;
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
    const isFeatured = req.query.isFeatured
      ? req.query.sFeatured === "true"
        ? true
        : req.query.sFeatured === "false"
          ? false
          : true
      : undefined;
    const authorId = req.query.authorId as string | undefined;

    const result = await postServices.getAllPosts({
      search: searchString,
      status: statusType,
      tags,
      isFeatured,
      authorId,

      //pagination
      page,
      limit,
      skip,

      //Sorting
      sortBy,
      sortOrder,
    });

    return res.status(200).json({
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
