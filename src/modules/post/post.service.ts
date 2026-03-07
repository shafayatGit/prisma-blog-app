import { Post } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
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
const getAllPosts = async ({
  search,
  tags,
  isFeatured,
}: {
  search: string | undefined;
  tags: string[] | [];
  isFeatured: boolean | undefined;
}) => {
  //searching through (title OR content OR single tag) OR (multiple tags)
  const andCondition: PostWhereInput[] = [];
  if (search) {
    andCondition.push({
      OR: [
        {
          title: {
            contains: search as string,
            mode: "insensitive", //case sensitive na.
          },
        },
        {
          content: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          tags: {
            //an array
            has: search as string,
          },
        },
      ],
    });
  }

  if (tags.length > 0) {
    andCondition.push({
      tags: {
        //using multiple tags for searching
        hasEvery: tags as string[],
      },
    });
  }

  if (typeof isFeatured == "boolean") {
    andCondition.push({
      isFeatured,
    });
  }

  const result = await prisma.post.findMany({
    where: {
      AND: andCondition,
    },
  });
  return result;
};

export const postServices = {
  createPost,
  getAllPosts,
};
