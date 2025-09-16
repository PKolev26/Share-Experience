import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    const updated = await prisma.review.update({
      where: { id },
      data: { isShared: true },
    });

    return Response.json({ success: true, review: updated });
  } catch (err) {
    console.error("Error updating review:", err);
    return Response.json({ success: false, error: "Update failed" }, { status: 500 });
  }
}
