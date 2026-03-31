"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!formData.email || !formData.password) {
        setError("Email e senha são obrigatórios");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erro ao fazer login");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Grid Background */}
      <div className="fixed inset-0 bg-grid-pattern opacity-5"></div>

      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        {/* Lado Esquerdo - Proposta de Valor */}
        <div className="hidden md:block space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-black text-white leading-tight">
              Foco na
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Multiplicação
              </span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              3 Cadastros + 3 Vendas = Sorteio de 1 Notebook
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="text-3xl">📋</div>
              <div>
                <h3 className="font-bold text-white mb-1">Cadastre 3 Consultores</h3>
                <p className="text-slate-400 text-sm">No mês vigente</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-3xl">💰</div>
              <div>
                <h3 className="font-bold text-white mb-1">Acompanhe o consultor na primeira venda</h3>
                <p className="text-slate-400 text-sm">Esteja lado a lado nos primeiros passos</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-3xl">🏆</div>
              <div>
                <h3 className="font-bold text-white mb-1">Registre e concorra ao Prêmio</h3>
                <p className="text-slate-400 text-sm">1 Notebook no sorteio</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-700">
            <p className="text-slate-400 text-sm italic leading-relaxed">
              "Quem multiplica, cresce. Quem cresce, lidera. Quem lidera, domina o jogo."
            </p>
          </div>
        </div>

        {/* Lado Direito - Login */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Bem-vindo</h2>
            <p className="text-slate-500">Faça login para acompanhar seu desempenho</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
            <button className="flex-1 px-4 py-2 bg-white text-blue-600 font-medium rounded-md shadow-sm">
              Login
            </button>
            <Link href="/signup" className="flex-1">
              <button className="w-full px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-md transition-colors">
                Primeira Vez
              </button>
            </Link>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
// Cache bust 1774929780
// Hard cache bust 1774930815
