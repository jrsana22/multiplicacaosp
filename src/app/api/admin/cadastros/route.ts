import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json({ message: "Token inválido" }, { status: 401 });
    }

    // Apenas DIRETOR_DE_EXPANSAO pode acessar
    if (payload.role !== "DIRETOR_DE_EXPANSAO") {
      return NextResponse.json(
        { message: "Acesso negado" },
        { status: 403 }
      );
    }

    // Buscar todos os cadastros com informações relacionadas
    const cadastros = await prisma.cadastro.findMany({
      include: {
        regional: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        venda: true,
        validacoes: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(cadastros);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro ao buscar cadastros" },
      { status: 500 }
    );
  }
}
