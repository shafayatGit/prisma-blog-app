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

//Getting All the posts.
const getAllPosts = async ({
  search,
  status,
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
}: {
  search: string | undefined;
  status: PostStatus | undefined;
  tags: string[] | [];
  isFeatured: boolean | undefined;
  authorId: string | undefined;

  //pagination
  page: number;
  limit: number;
  skip: number;

  // Sorting
  sortBy: string;
  sortOrder: string;
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

  // Searching through authorId
  if (authorId) {
    andCondition.push({
      authorId,
    });
  }

  const result = await prisma.post.findMany({
    //Fpr pagination
    take: limit,
    skip,

    //for Sorting
    orderBy: { [sortBy]: sortOrder },

    where: {
      AND: andCondition,
    },
  });

  //!Getting total data
  const total = await prisma.post.count({
    where: {
      AND: andCondition,
    },
  });

  return {
    data: result,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getPostById = async (postId: string) => {
  //!Integrating Transaction and Rollback --> means both have to be finished. If not then not anyone will perform
  const result = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    const getPost = await tx.post.findUnique({
      where: {
        id: postId,
      },
    });
    return getPost;
  });
  return result;
};

export const postServices = {
  createPost,
  getAllPosts,
  getPostById,
};
