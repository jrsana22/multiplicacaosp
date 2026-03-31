import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json({ message: "Token inválido" }, { status: 401 });
    }

    const cadastro = await prisma.cadastro.findUnique({
      where: { id },
    });

    if (!cadastro) {
      return NextResponse.json(
        { message: "Cadastro não encontrado" },
        { status: 404 }
      );
    }

    if (
      payload.role === "REGIONAL" &&
      cadastro.regionalId !== payload.userId
    ) {
      return NextResponse.json(
        { message: "Permissão negada" },
        { status: 403 }
      );
    }

    await prisma.cadastro.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Cadastro deletado com sucesso" });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro ao deletar cadastro" },
      { status: 500 }
    );
  }
}
