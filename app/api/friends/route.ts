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
    include: {
      user: { select: { id: true, name: true, image: true } },
      friend: { select: { id: true, name: true, image: true } },
    },
  });

  const friends = relations.map((r) =>
    r.userId === currentUserId ? r.friend : r.user
  );

  return Response.json(friends);
}
