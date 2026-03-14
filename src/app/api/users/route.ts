import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only Admin (DM) can create users
    if (!session || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Non autorizzato", { status: 401 });
    }

    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return new NextResponse("Dati mancanti", { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse("Utente già esistente con questa email", { status: 409 });
    }

    const passwordHash = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: role === "ADMIN" ? "ADMIN" : "USER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("User creation error:", error);
    return new NextResponse("Errore interno del server", { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Only Admin can list users
    if (!session || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Non autorizzato", { status: 401 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(users);
  } catch (error) {
    return new NextResponse("Errore interno del server", { status: 500 });
  }
}
