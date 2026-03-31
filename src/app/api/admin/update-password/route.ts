import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json({ message: "Token inválido" }, { status: 401 });
    }

    if (payload.role !== "DIRETOR_DE_EXPANSAO") {
      return NextResponse.json(
        { message: "Acesso negado" },
        { status: 403 }
      );
    }

    const { email, newPassword } = await request.json();

    if (!email || !newPassword) {
      return NextResponse.json(
        { message: "Email e nova senha são obrigatórios" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return NextResponse.json({
      message: "Senha atualizada com sucesso",
      email: user.email,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro ao atualizar senha" },
      { status: 500 }
    );
  }
}
