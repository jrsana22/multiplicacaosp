import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Campanha Consultores - Erivaldo",
  description: "Sistema de rastreamento de cadastros e vendas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
