import { NextResponse } from "next/server";
import { clearTokenCookie } from "@/lib/auth";

export async function POST() {
  try {
    await clearTokenCookie();

    const response = NextResponse.redirect(new URL("https://multiplicacaosp.solucoesdeia.com/login"));
    response.cookies.delete("token");

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.redirect(new URL("https://multiplicacaosp.solucoesdeia.com/login"));
  }
}
