import { Post, PostStatus } from "../../../generated/prisma/client";
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
  status,
  tags,
  isFeatured,
  authorId,
}: {
  search: string | undefined;
  status: PostStatus | undefined;
  tags: string[] | [];
  isFeatured: boolean | undefined;
  authorId: string | undefined;
}) => {
  // console.log(tags);
  const andCondition: PostWhereInput[] = [];
  if (search) {
    andCondition.push({
      OR: [
        {
          title: {
            contains: search as string,
            mode: "insensitive",
          },
        },

        {
          content: {
            contains: search as string,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  // searching through enum value
  if (status) {
    andCondition.push({
      status, // enum value
    });
  }

  // searching through an array
  if (tags.length > 0) {
    andCondition.push({
      tags: {
        //using multiple tags for searching
        hasEvery: tags as string[],
      },
    });
  }

  // Searching through boolean value
  if (typeof isFeatured === "boolean") {
    andCondition.push({
      isFeatured,
    });
  }

  if (authorId) {
    andCondition.push({
      authorId,
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
