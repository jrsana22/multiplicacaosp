import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/db";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json({ message: "Token inválido" }, { status: 401 });
    }

    const cadastros = await prisma.cadastro.findMany({
      where:
        payload.role === "DIRETOR_DE_EXPANSAO"
          ? {}
          : {
              regionalId: payload.userId,
            },
      include: {
        venda: true,
        regional: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(cadastros, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Erro ao buscar cadastros" },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json({ message: "Token inválido" }, { status: 401 });
    }

    if (payload.role !== "REGIONAL") {
      return NextResponse.json(
        { message: "Permissão negada. Você precisa estar logado como REGIONAL para criar cadastros. Role atual: " + payload.role },
        { status: 403 }
      );
    }

    const body = await request.json();

    const { nomeConsultor, dataCadastro, fezVenda, dataVenda } = body;

    if (!nomeConsultor || !dataCadastro) {
      return NextResponse.json(
        { message: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }

    const cadastro = await prisma.cadastro.create({
      data: {
        nomeConsultor,
        dataCadastro: new Date(dataCadastro),
        regionalId: payload.userId,
        venda: fezVenda
          ? {
              create: {
                dataVenda: new Date(dataVenda),
                status: "PENDENTE",
              },
            }
          : undefined,
      },
      include: {
        venda: true,
      },
    });

    return NextResponse.json(cadastro, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Erro ao criar cadastro" },
      { status: 400 }
    );
  }
}
