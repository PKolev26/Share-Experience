import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const friends = await prisma.userFriends.findMany({
    where: { userId: session.user.id },
    include: {
      friend: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  return NextResponse.json(
    friends.map((f) => ({
      id: f.friend.id,
      name: f.friend.name,
      image: f.friend.image, 
    }))
  );
}
