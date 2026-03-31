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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-1 text-gray-900">
          Campanha Consultores
        </h1>
        <p className="text-center text-gray-600 mb-8 text-sm">
          Sistema de Rastreamento de Cadastros e Vendas
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button className="flex-1 px-4 py-2 text-blue-600 border-b-2 border-blue-600 font-medium">
            Fazer Login
          </button>
          <Link href="/signup">
            <button className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-900 font-medium">
              Primeiro Acesso
            </button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {/* Credenciais de Teste */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-gray-700">
          <p className="font-bold mb-2">🧪 Credenciais de Teste:</p>
          <div className="space-y-2 text-xs">
            <div>
              <p className="font-medium text-gray-900">Líder:</p>
              <p className="text-gray-600">
                lider@test.com / senha123
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-900">Regional 1:</p>
              <p className="text-gray-600">
                regional1@test.com / senha123
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-900">Regional 2:</p>
              <p className="text-gray-600">
                regional2@test.com / senha123
              </p>
            </div>
          </div>
        </div>

        {/* Rodapé Explicativo */}
        <div className="mt-6 pt-6 border-t border-gray-200 space-y-3 text-xs text-gray-600">
          <div className="flex gap-2">
            <span className="text-lg">📝</span>
            <div>
              <p className="font-medium text-gray-900">Primeira Vez?</p>
              <p>Clique em "Primeiro Acesso" para criar sua senha</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="text-lg">🔐</span>
            <div>
              <p className="font-medium text-gray-900">Já tem Conta?</p>
              <p>Use seu email e senha para fazer login</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="text-lg">⚠️</span>
            <div>
              <p className="font-medium text-gray-900">Problemas?</p>
              <p>Entre em contato com seu líder de equipe</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
