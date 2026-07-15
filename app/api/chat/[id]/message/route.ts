import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; 
  const chatId = id;

  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

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
