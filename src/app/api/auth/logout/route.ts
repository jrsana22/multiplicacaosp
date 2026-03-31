import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.redirect(new URL("https://multiplicacaosp.solucoesdeia.com/login"), {
    status: 302,
  });
  response.cookies.delete("token");
  return response;
}
