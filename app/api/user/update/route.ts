import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { username, email, firstName, lastName, image } = await req.json();

  if (username) {
    const existing = await prisma.user.findFirst({
      where: { name: username, NOT: { id: session.user.id } },
    });
    if (existing)
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 400 }
      );
  }

  if (email) {
    const existing = await prisma.user.findFirst({
      where: { email, NOT: { id: session.user.id } },
    });
    if (existing)
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
  }

  if ((firstName && !lastName) || (!firstName && lastName)) {
    return NextResponse.json(
      { error: "Both firstname and lastname are required" },
      { status: 400 }
    );
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: username,
      email,
      firstname: firstName,
      lastname: lastName,
      image,
    },
  });

  return NextResponse.json(user);
}
