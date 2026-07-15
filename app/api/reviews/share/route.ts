import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();

  if (!id) {
    return Response.json({ error: "Missing review id" }, { status: 400 });
  }

  const result = await prisma.review.updateMany({
    where: {
      id,
      userId: session.user.id,
    },
    data: {
      isShared: true,
    },
  });

  if (result.count === 0) {
    return Response.json(
      { error: "Review not found or forbidden" },
      { status: 404 }
    );
  }

  return Response.json({ success: true });
}