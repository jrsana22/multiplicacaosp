"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email) {
      setError("Email é obrigatório");
      return;
    }

    setStep(2);
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.name || !formData.password || !formData.confirmPassword) {
      setError("Todos os campos são obrigatórios");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      setLoading(false);
      return;
    }

    if (formData.password.length < 3) {
      setError("Senha deve ter no mínimo 3 caracteres");
      setLoading(false);
      return;
    }

    setStep(3);
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
              Bem-vindo
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                à Multiplicação
              </span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              Crie sua conta e comece a participar do desafio
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🚀</div>
              <div>
                <h3 className="font-bold text-white mb-1">Fácil e Rápido</h3>
                <p className="text-slate-400 text-sm">Crie sua conta em poucos passos</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-3xl">🔐</div>
              <div>
                <h3 className="font-bold text-white mb-1">Seguro</h3>
                <p className="text-slate-400 text-sm">Sua senha fica protegida e segura</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-3xl">🎯</div>
              <div>
                <h3 className="font-bold text-white mb-1">Pronto para Desafiar</h3>
                <p className="text-slate-400 text-sm">Inicie seus cadastros e acompanhe as vendas dos consultores</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-700">
            <p className="text-slate-400 text-sm italic leading-relaxed">
              3 Cadastros + 3 Vendas = Sorteio de 1 Notebook
            </p>
          </div>
        </div>

        {/* Lado Direito - Signup Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-8">
          {/* Step 1 */}
          {step === 1 && (
            <>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">Primeira Vez?</h2>
                <p className="text-slate-500">Crie sua conta para começar</p>
              </div>

              <form onSubmit={handleStep1} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="seu@email.com"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-2">Use o email da sua regional</p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Continuar
                </button>
              </form>
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">Crie Sua Senha</h2>
                <p className="text-slate-500">Escolha uma senha forte</p>
              </div>

              <form onSubmit={handleStep2} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Seu nome"
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
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Confirmar Senha
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  {loading ? "Criando..." : "Criar Conta"}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-slate-600 hover:text-slate-900 font-medium py-2 px-4 border border-slate-300 rounded-lg transition-colors"
                >
                  Voltar
                </button>
              </form>
            </>
          )}

          {/* Step 3 - Success */}
          {step === 3 && (
            <div className="text-center space-y-6">
              <div className="text-6xl">🎉</div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">Tudo Pronto!</h2>
                <p className="text-slate-600">Sua conta foi criada com sucesso</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-900">Email cadastrado:</p>
                  <p className="text-sm text-slate-600 font-mono">{formData.email}</p>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-900">Nome:</p>
                  <p className="text-sm text-slate-600">{formData.name}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  router.push("/login");
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Ir para Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
