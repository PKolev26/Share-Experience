import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET() {
    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id;

  const chats = await prisma.chat.findMany({
  where: {
    users: { some: { userId: currentUserId } },
  },
  include: {
    users: { include: { user: true } },
    messages: {
      take: 1,
      orderBy: { createdAt: "desc" },
      include: { sender: true },
    },
  },
  orderBy: { updatedAt: "desc" },
});

const normalized = chats.map((chat) => {
  const friend = chat.users.find((u) => u.userId !== currentUserId)?.user;
  return {
    id: chat.id,
    friend,
    lastMessage: chat.messages[0] || null,
  };
});

return Response.json(normalized);

}
