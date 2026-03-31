import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/db";
import { cookies } from "next/headers";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("DELETE regional chamado com ID:", params.id);
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json({ message: "Token inválido" }, { status: 401 });
    }

    // Apenas diretor pode deletar regionais
    if (payload.role !== "DIRETOR_DE_EXPANSAO") {
      return NextResponse.json(
        { message: "Permissão negada" },
        { status: 403 }
      );
    }

    // Buscar regional
    const regional = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!regional) {
      return NextResponse.json(
        { message: "Regional não encontrado" },
        { status: 404 }
      );
    }

    // Deletar regional (cascata deleta cadastros e vendas também)
    await prisma.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Regional deletado com sucesso" });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro ao deletar regional" },
      { status: 500 }
    );
  }
}
