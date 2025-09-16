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

  const message = await prisma.message.create({
    data: {
      chatId,
      senderId: currentUserId,
      content,
    },
    include: { sender: true },
  });

  return Response.json(message);
}
