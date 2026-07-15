import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;
  const { id: friendId } = await context.params;

  if (!currentUserId) {
    return new Response("Unauthorized", { status: 401 });
  }

  let chat = await prisma.chat.findFirst({
    where: {
      AND: [
        { users: { some: { userId: currentUserId } } },
        { users: { some: { userId: friendId } } },
      ],
    },
    include: {
      users: { include: { user: true } },
      messages: { include: { sender: true }, orderBy: { createdAt: "asc" } },
    },
  });


  if (!chat) {
    chat = await prisma.chat.create({
      data: {
        users: {
          create: [
            { userId: currentUserId },
            { userId: friendId },
          ],
        },
      },
      include: {
        users: { include: { user: true } },
        messages: { include: { sender: true } },
      },
    });
  }

  const relation = await prisma.userFriends.findFirst({
    where: {
      OR: [
        { userId: currentUserId, friendId },
        { userId: friendId, friendId: currentUserId },
      ],
    },
  });

  return Response.json({
    ...chat,
    isFriend: !!relation,
  });
}

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;
  const { id: chatId } = await context.params;

  if (!currentUserId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { content } = await req.json();

  const membership = await prisma.chatUser.findUnique({
    where: {
      chatId_userId: {
        chatId,
        userId: currentUserId,
      },
  },
  });

  if (!membership) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  if (typeof content !== "string" || !content.trim()) {
    return Response.json({ error: "Message is required" }, { status: 400 });
  }

  if (content.length > 2000) {
    return Response.json({ error: "Message is too long" }, { status: 400 });
  }

  const message = await prisma.message.create({
    data: {
      chatId,
      senderId: currentUserId,
      content: content.trim()
    },
    include: { sender: true },
  });

  return Response.json(message);
}
