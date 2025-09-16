import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  if (!currentUserId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const relations = await prisma.userFriends.findMany({
    where: {
      OR: [{ userId: currentUserId }, { friendId: currentUserId }],
    },
    include: {
      user: { select: { id: true, name: true, image: true } },
      friend: { select: { id: true, name: true, image: true } },
    },
  });

 const friendsMap = new Map<
  string,
  { id: string; name: string | null; image: string | null }
>();

relations.forEach((r) => {
  const friend = r.userId === currentUserId ? r.friend : r.user;
  if (friend) {
    friendsMap.set(friend.id, {
      id: friend.id,
      name: friend.name ?? null,
      image: friend.image ?? null,
    });
  }
});

const friends = Array.from(friendsMap.values());


  return Response.json(friends);
}


export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  if (!currentUserId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { friendId } = await req.json();
  if (!friendId) {
    return new Response("Friend ID is required", { status: 400 });
  }

  const existing = await prisma.userFriends.findFirst({
    where: {
      OR: [
        { userId: currentUserId, friendId },
        { userId: friendId, friendId: currentUserId },
      ],
    },
  });

  if (existing) {
    return new Response("Already friends", { status: 400 });
  }

  await prisma.userFriends.create({
    data: {
      userId: currentUserId,
      friendId,
    },
  });

  const friend = await prisma.user.findUnique({
    where: { id: friendId },
    select: { id: true, name: true, image: true },
  });

  return Response.json(friend);
}
