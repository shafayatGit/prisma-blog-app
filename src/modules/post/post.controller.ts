import { Request, Response } from "express";
import { postServices } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helper/paginationSorting";
import { UserRole } from "../../middleware/auth";

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
    //! Pagination $$ Sorting
    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
      req.query,
    );

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

const getPostById = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      throw new Error("Post id required");
    }
    const result = await postServices.getPostById(postId as string);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      status: false,
      message: "Failed to get the post",
    });
  }
};

const getMyAllPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const result = await postServices.getMyAllPost(user?.id as string);
    res.status(200).json({
      data: result,
    });
  } catch (error: any) {
    // console.log(error);
    return res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

const updateMyPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { postId } = req.params;

    const isAdmin = req.user?.role === UserRole.ADMIN;

    const result = await postServices.updateMyPost(
      user?.id as string,
      postId as string,
      req.body,
      isAdmin as boolean,
    );
    res.status(200).json({
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

const deletePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { postId } = req.params;

    const isAdmin = req.user?.role === UserRole.ADMIN;

    const result = await postServices.deletePost(postId as string,user?.id as string,isAdmin as boolean);
    res.status(200).json({
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

const getPostStats = async (req: Request, res: Response) => {
  try {
    const result = await postServices.getPostStats();
    res.status(200).json({
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};
export const PostConteroller = {
  createPost,
  getAllPosts,
  getPostById,
  getMyAllPost,
  updateMyPost,
  deletePost,
  getPostStats
};
