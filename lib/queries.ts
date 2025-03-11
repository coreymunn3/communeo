"use server";
import { prisma } from "@/lib/prisma";

export async function getFeedPosts(userId?: string) {
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
    },
    orderBy: {
      created_on: "desc",
    },
  });
}

export async function getPost(postId: string) {
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
  });
}

export async function getCommunityById(communityId: string) {
  return await prisma.community.findUnique({
    where: {
      id: communityId,
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
