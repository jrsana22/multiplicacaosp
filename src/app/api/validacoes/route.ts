import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/db";
import { cookies } from "next/headers";

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

    if (payload.role !== "LIDER") {
      return NextResponse.json(
        { message: "Permissão negada. Apenas líderes podem validar" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { cadastroId, vendaId, status, comentario } = body;

    if (!status || !["APROVADO", "REJEITADO"].includes(status)) {
      return NextResponse.json(
        { message: "Status inválido" },
        { status: 400 }
      );
    }

    if (!cadastroId && !vendaId) {
      return NextResponse.json(
        { message: "cadastroId ou vendaId é obrigatório" },
        { status: 400 }
      );
    }

    // Create validation record
    const validacao = await prisma.validacao.create({
      data: {
        cadastroId: cadastroId || undefined,
        vendaId: vendaId || undefined,
        validadorId: payload.userId,
        status,
        comentario: comentario || undefined,
      },
    });

    // Update status in cadastro or venda
    if (cadastroId) {
      await prisma.cadastro.update({
        where: { id: cadastroId },
        data: {
          status: status === "APROVADO" ? "VALIDADO" : "REJEITADO",
        },
      });
    }

    if (vendaId) {
      await prisma.venda.update({
        where: { id: vendaId },
        data: {
          status: status === "APROVADO" ? "VALIDADO" : "REJEITADO",
        },
      });
    }

    return NextResponse.json(validacao, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Erro ao validar" },
      { status: 400 }
    );
  }
}
