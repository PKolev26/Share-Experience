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

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return Response.json([]);
  }

  const results = await prisma.user.findMany({
    where: {
      name: {
        contains: query,
        mode: "insensitive",
      },
      NOT: {
        id: currentUserId,
      },
    },
    select: {
      id: true,
      name: true,
      image: true,
    },
    take: 10,
  });

  return Response.json(results);
}
