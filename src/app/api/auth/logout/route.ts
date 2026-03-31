import { NextRequest, NextResponse } from "next/server";
import { clearTokenCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await clearTokenCookie();

    const response = NextResponse.redirect(new URL("https://multiplicacaosp.solucoesdeia.com/login"), {
      status: 302,
    });
    response.cookies.delete("token");

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.redirect(new URL("https://multiplicacaosp.solucoesdeia.com/login"), {
      status: 302,
    });
  }
}
