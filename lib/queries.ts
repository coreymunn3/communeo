"use server";
import { prisma } from "@/lib/prisma";

export async function getPostsForUser(userId?: string) {
  return await prisma.post.findMany({
    where: {
      community: {
        members: {
          some: {
            user_id: userId,
          },
        },
      },
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          avatar_url: true,
        },
      },
      community: {
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
        },
      },
      flair: true,
    },
    orderBy: [
      { created_on: "desc" },
      {
        votes: {
          _count: "desc",
        },
      },
    ],
  });
}

export async function getCommunityPosts(communityId: string) {
  return await prisma.post.findMany({
    where: {
      community_id: communityId,
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          avatar_url: true,
        },
      },
      community: {
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
        },
      },
      flair: true,
    },
    orderBy: {
      created_on: "desc",
    },
  });
}

export async function getPostById(postId: string) {
  return await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          avatar_url: true,
        },
      },
      community: {
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
        },
      },
      flair: true,
    },
  });
}

export async function getComments(postId: string) {
  return await prisma.comment.findMany({
    where: {
      post_id: postId,
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          avatar_url: true,
        },
      },
    },
  });
}

export async function getCommunityFromSlug(slug: string) {
  return await prisma.community.findUnique({
    where: {
      slug,
    },
    include: {
      flairs: true,
    },
  });
}

export async function getCommunityById(communityId: string) {
  return await prisma.community.findUnique({
    where: {
      id: communityId,
    },
    include: {
      flairs: true,
    },
  });
}

export async function getUserCommunities(userId: string) {
  return await prisma.community.findMany({
    where: {
      members: {
        some: {
          user_id: userId,
        },
      },
    },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      icon: true,
      founder_id: true,
      moderator_id: true,
      _count: {
        select: {
          members: true,
        },
      },
    },
  });
}

export async function getUserMembershipInCommunity(
  communityId: string,
  userId: string
) {
  return await prisma.community_member.findFirst({
    where: {
      user_id: userId,
      community_id: communityId,
    },
  });
}

export async function getPostsFromSearchTerm(
  searchTerm: string,
  communityId?: string
) {
  return await prisma.post.findMany({
    where: {
      OR: [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { content: { contains: searchTerm, mode: "insensitive" } },
      ],
      ...(communityId && { community_id: communityId }),
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          avatar_url: true,
        },
      },
      community: {
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
        },
      },
      flair: true,
    },
    orderBy: {
      created_on: "desc",
    },
  });
}

export async function getUserFromUsername(username: string) {
  return await prisma.app_user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
      username: true,
      avatar_url: true,
      email: true,
      created_on: true,
    },
  });
}

export async function getPostsByUserId(userId: string) {
  return await prisma.post.findMany({
    where: {
      user_id: userId,
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          avatar_url: true,
        },
      },
      community: {
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
        },
      },
      flair: true,
    },
  });
}

export async function getCommentsByUserId(userId: string) {
  return await prisma.comment.findMany({
    where: {
      user_id: userId,
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          avatar_url: true,
        },
      },
    },
  });
}
