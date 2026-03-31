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

    // Buscar todos os regionais com contagem de cadastros
    const regionais = await prisma.user.findMany({
      where: {
        role: "REGIONAL",
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        cadastros: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transformar para incluir contagem de cadastros
    const regionaisComContagem = regionais.map((regional) => ({
      id: regional.id,
      name: regional.name,
      email: regional.email,
      createdAt: regional.createdAt,
      cadastros: regional.cadastros.length,
    }));

    return NextResponse.json(regionaisComContagem);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro ao buscar regionais" },
      { status: 500 }
    );
  }
}
