import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <nav className="bg-slate-800/50 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💰</span>
              <h1 className="text-2xl font-bold text-white">
                Campanha Consultores
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-slate-300">
                  {user.name}
                </p>
                <p className="text-xs text-slate-500">
                  {user.role === "DIRETOR_DE_EXPANSAO" ? "Diretor de Expansão" : "Regional"} • {user.email}
                </p>
              </div>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Sair
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {user.role === "DIRETOR_DE_EXPANSAO" && (
        <div className="bg-slate-800/50 border-b border-slate-700 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-6 h-12 items-center">
              <Link
                href="/dashboard/lider"
                className="text-slate-300 hover:text-white font-semibold transition-colors border-b-2 border-transparent hover:border-blue-500 h-full flex items-center"
              >
                Ranking
              </Link>
              <Link
                href="/dashboard/regionais"
                className="text-slate-300 hover:text-white font-semibold transition-colors border-b-2 border-transparent hover:border-blue-500 h-full flex items-center"
              >
                Regionais
              </Link>
              <Link
                href="/dashboard/admin"
                className="text-slate-300 hover:text-white font-semibold transition-colors border-b-2 border-transparent hover:border-blue-500 h-full flex items-center"
              >
                Todos os Cadastros
              </Link>
            </div>
          </div>
        </div>
      )}

      {user.role === "REGIONAL" && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4">
          <div className="flex items-start gap-3">
            <div className="text-red-600 font-bold text-xl">⚠️</div>
            <div>
              <h3 className="font-bold text-red-800">REGRA IMPORTANTE</h3>
              <p className="text-red-700 text-sm">NÃO VALE O PRÓPRIO VEÍCULO COMO VENDA!</p>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
