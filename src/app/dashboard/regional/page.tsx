"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegionalDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    nomeConsultor: "",
    dataCadastro: "",
    fezVenda: false,
    dataVenda: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as any;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!formData.nomeConsultor || !formData.dataCadastro) {
        setError("Nome do consultor e data são obrigatórios");
        setLoading(false);
        return;
      }

      if (formData.fezVenda && !formData.dataVenda) {
        setError("Data da venda é obrigatória");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/cadastros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomeConsultor: formData.nomeConsultor,
          dataCadastro: new Date(formData.dataCadastro).toISOString(),
          fezVenda: formData.fezVenda,
          dataVenda: formData.fezVenda
            ? new Date(formData.dataVenda).toISOString()
            : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erro ao criar cadastro");
        setLoading(false);
        return;
      }

      setSuccess("Cadastro criado com sucesso!");
      setFormData({
        nomeConsultor: "",
        dataCadastro: "",
        fezVenda: false,
        dataVenda: "",
      });

      // Reload page after 2 seconds
      setTimeout(() => {
        router.refresh();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Erro ao criar cadastro");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 gap-6">
        {/* Formulário */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-6 text-gray-900">
            Novo Cadastro
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Consultor *
                </label>
                <input
                  type="text"
                  name="nomeConsultor"
                  value={formData.nomeConsultor}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nome completo"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data do Cadastro *
                </label>
                <input
                  type="date"
                  name="dataCadastro"
                  value={formData.dataCadastro}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="fezVenda"
                checked={formData.fezVenda}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label className="text-sm font-medium text-gray-700">
                Fez a primeira venda?
              </label>
            </div>

            {formData.fezVenda && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data da Venda *
                </label>
                <input
                  type="date"
                  name="dataVenda"
                  value={formData.dataVenda}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {loading ? "Salvando..." : "Salvar Cadastro"}
            </button>
          </form>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-2">ℹ️ Informações</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Preencha os dados do novo consultor cadastrado</li>
            <li>Se já fez a primeira venda, marque a opção e informe a data</li>
            <li>O líder de estado verá todos os registros em tempo real</li>
            <li>Documentação será validada antes da premiação</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
