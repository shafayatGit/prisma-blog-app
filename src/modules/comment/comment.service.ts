import { prisma } from "../../lib/prisma";

const createComment = async ({
  content,
  authorId,
  postId,
  parentId,
}: {
  content: string;
  authorId: string;
  postId: string;
  parentId?: string | undefined;
}) => {
  // checking if the postId is axist or not
  await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  // checking if the parentId is avaibleable then is it axist or not
  if (parentId) {
    await prisma.comment.findUniqueOrThrow({
      where: {
        id: parentId,
      },
    });
  }

  const result = await prisma.comment.create({
    data: {
      content,
      authorId,
      postId,
      parentId: parentId ?? null,
    },
  });
  return result;
};
export const commentService = {
  createComment,
};
