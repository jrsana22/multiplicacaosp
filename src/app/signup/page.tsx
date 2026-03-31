"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1: email, 2: dados, 3: sucesso

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

    // Aqui você poderia verificar se o email existe e é válido
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

    try {
      // Aqui você faria uma requisição para criar o usuário
      // Por enquanto, apenas simulamos sucesso
      setStep(3);
    } catch (err: any) {
      setError(err.message || "Erro ao cadastrar");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">
          Campanha Consultores
        </h1>
        <p className="text-center text-gray-600 mb-8">🎉 Primeiro Acesso</p>

        {step === 1 && (
          <form onSubmit={handleStep1} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="seu@email.com"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Use o email que recebeu do líder
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Continuar
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleStep2} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Seu nome"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Criar Senha
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Mínimo 3 caracteres
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Senha
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {loading ? "Criando..." : "Criar Conta"}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-gray-600 hover:text-gray-900 font-medium py-2 px-4 border border-gray-300 rounded-lg transition-colors"
            >
              Voltar
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="text-center space-y-4">
            <div className="text-6xl">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900">
              Bem-vindo(a)!
            </h2>
            <p className="text-gray-600">
              Sua conta foi criada com sucesso. Você pode fazer login agora.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
              <p className="font-medium mb-2">Email: {formData.email}</p>
              <p className="text-xs">Salve essas credenciais com segurança</p>
            </div>

            <button
              onClick={() => router.push("/login")}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Ir para Login
            </button>
          </div>
        )}

        {/* Rodapé */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            💡 <strong>Primeiro acesso?</strong> Crie sua senha aqui. Próximas vezes, use
            a opção "Fazer Login" com o email e senha.
          </p>
          <div className="mt-3 space-y-1 text-xs text-gray-500 list-disc list-inside">
            <p>✓ Você recebeu este link do seu líder de equipe</p>
            <p>✓ Crie uma senha forte e memorável</p>
            <p>✓ Após criar, faça login em /login</p>
          </div>
        </div>
      </div>
    </div>
  );
}
