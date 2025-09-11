import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  const relations = await prisma.userFriends.findMany({
    where: {
      OR: [{ userId: currentUserId }, { friendId: currentUserId }],
    },
  });

  const friendIds = relations.map((r) =>
    r.userId === currentUserId ? r.friendId : r.userId
  );

const feed = await prisma.review.findMany({
  where: {
    userId: { in: friendIds },
    isShared: true,
  },
  include: {
    user: { select: { id: true, name: true, image: true } },
  },
  orderBy: { createdAt: "desc" },
});




  return Response.json(feed);
}
