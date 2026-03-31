import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/db";
import { cookies } from "next/headers";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("DELETE cadastro chamado com ID:", params.id);
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json({ message: "Token inválido" }, { status: 401 });
    }

    // Buscar cadastro
    const cadastro = await prisma.cadastro.findUnique({
      where: { id: params.id },
    });

    if (!cadastro) {
      return NextResponse.json(
        { message: "Cadastro não encontrado" },
        { status: 404 }
      );
    }

    // Verificar permissão: regional só pode deletar seus próprios, diretor pode deletar qualquer um
    if (
      payload.role === "REGIONAL" &&
      cadastro.regionalId !== payload.userId
    ) {
      return NextResponse.json(
        { message: "Permissão negada" },
        { status: 403 }
      );
    }

    // Deletar cadastro (cascata deleta venda também)
    await prisma.cadastro.delete({
      where: { id: params.id },
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
