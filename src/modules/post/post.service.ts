import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

//Creating All the Posts
const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">,
  userId: string,
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
  return result;
};

//Getting All the posts
const getAllPosts = async () => {
  const result = await prisma.post.findMany();
  return result;
};

export const postServices = {
  createPost,
  getAllPosts,
};
