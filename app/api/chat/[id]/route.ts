import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;
  const { id } = await context.params; 
  const friendId = id;

  if (!currentUserId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const relation = await prisma.userFriends.findFirst({
    where: {
      OR: [
        { userId: currentUserId, friendId },
        { userId: friendId, friendId: currentUserId },
      ],
    },
  });

  if (!relation) {
    return new Response("Not friends", { status: 403 });
  }

  let chat = await prisma.chat.findFirst({
    where: {
      users: {
        some: { userId: currentUserId },
      },
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

  return Response.json(chat);
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  if (!currentUserId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { content } = await req.json();

  const message = await prisma.message.create({
    data: {
      chatId: params.id,
      senderId: currentUserId,
      content,
    },
    include: { sender: true },
  });

  return Response.json(message);
}
