import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { image } = await req.json();

  const updatedUser = await prisma.user.update({
    where: { id: session.user.id },
    data: { image },
  });

  return Response.json(updatedUser);
}
