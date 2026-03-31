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

    if (payload.role !== "DIRETOR_DE_EXPANSAO") {
      return NextResponse.json(
        { message: "Permissão negada" },
        { status: 403 }
      );
    }

    await prisma.user.delete({
      where: { id },
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
