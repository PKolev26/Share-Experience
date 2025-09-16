import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  const { id: friendId } = await context.params;

  if (!currentUserId) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!friendId) {
    return new Response("Friend ID is required", { status: 400 });
  }

  await prisma.userFriends.deleteMany({
    where: {
      OR: [
        { userId: currentUserId, friendId },
        { userId: friendId, friendId: currentUserId },
      ],
    },
  });

  return new Response("Friend removed", { status: 200 });
}
