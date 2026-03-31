import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import { createToken, setTokenCookie } from "@/lib/auth";
import { LoginSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = LoginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Email ou senha inválidos" },
        { status: 401 }
      );
    }

    const passwordValid = await bcrypt.compare(
      validated.password,
      user.password
    );

    if (!passwordValid) {
      return NextResponse.json(
        { message: "Email ou senha inválidos" },
        { status: 401 }
      );
    }

    const token = await createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.json(
      { message: "Login realizado com sucesso" },
      { status: 200 }
    );

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Erro ao fazer login" },
      { status: 400 }
    );
  }
}
