import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email");
    const newPassword = searchParams.get("newPassword");

    if (!email || !newPassword) {
      return NextResponse.json(
        { message: "Email e newPassword são obrigatórios" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return NextResponse.json({
      message: "✅ Senha atualizada com sucesso!",
      email: user.email,
      name: user.name,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: "❌ Erro ao atualizar senha. Email não encontrado?" },
      { status: 500 }
    );
  }
}
