import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { rating, comment, placeName, longitude, latitude, friends } = body;

    if (!rating || !comment || !placeName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        rating,
        comment,
        placeName,
        longitude,
        latitude,
        friends: {
          create: friends.map((f: { id: string }) => ({
            friend: { connect: { id: f.id } },
          })),
        },
      },
      include: { friends: true },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating review:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
