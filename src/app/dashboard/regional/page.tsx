"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Cadastro {
  id: string;
  nomeConsultor: string;
  dataCadastro: string;
  status: string;
  venda?: {
    dataVenda: string;
    status: string;
  } | null;
}

export default function RegionalDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cadastros, setCadastros] = useState<Cadastro[]>([]);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileName, setFileName] = useState("");

  const [formData, setFormData] = useState({
    nomeConsultor: "",
    dataCadastro: "",
    fezVenda: false,
    dataVenda: "",
    comprovacao: null as File | null,
  });

  useEffect(() => {
    fetchCadastros();

    // Refetch automático a cada 30s
    const interval = setInterval(fetchCadastros, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchCadastros = async () => {
    try {
      const res = await fetch("/api/cadastros");
      const data = await res.json();
      if (res.ok) {
        setCadastros(data);
      }
    } catch (err) {
      console.error("Erro ao buscar cadastros:", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as any;
    if (type === "file") {
      const file = (e.target as HTMLInputElement).files?.[0];
      setFormData((prev) => ({
        ...prev,
        comprovacao: file || null,
      }));
      setFileName(file?.name || "");
      setFileUploaded(!!file);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      }));
    }
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

      let urlComprovacaoCadastro = "";
      let urlComprovacaoVenda = "";

      // Upload comprovação do cadastro
      if (formData.comprovacao) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", formData.comprovacao);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        });

        if (!uploadRes.ok) {
          setError("Erro ao fazer upload do arquivo");
          setLoading(false);
          return;
        }

        const uploadData = await uploadRes.json();
        urlComprovacaoCadastro = uploadData.url;
        if (formData.fezVenda) {
          urlComprovacaoVenda = uploadData.url;
        }
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
          urlComprovacaoCadastro: urlComprovacaoCadastro || undefined,
          urlComprovacaoVenda: urlComprovacaoVenda || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erro ao criar cadastro");
        setLoading(false);
        return;
      }

      setSuccess("✅ Cadastro criado com sucesso!");
      setFormData({
        nomeConsultor: "",
        dataCadastro: "",
        fezVenda: false,
        dataVenda: "",
        comprovacao: null,
      });
      setFileUploaded(false);
      setFileName("");

      setTimeout(() => {
        fetchCadastros();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Erro ao criar cadastro");
      setLoading(false);
    }
  };

  const totalCadastros = cadastros.length;
  const totalVendas = cadastros.filter((c) => c.venda).length;
  const desafioCompleto = totalCadastros >= 3 && totalVendas >= 3;

  return (
    <div className="space-y-6">
      {/* Progress Banner */}
      <div className={`rounded-xl p-8 ${desafioCompleto ? 'bg-slate-800/30 border border-green-500/30' : 'bg-slate-800/30 border border-slate-700'}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Desafio do Mês</h2>
            <p className="text-slate-300">3 Cadastros + 3 Vendas = Sorteio do Notebook</p>
          </div>
          <div className="text-5xl">{desafioCompleto ? '🏆' : '⚡'}</div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Cadastros Progress */}
          <div>
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-slate-300 font-medium">Cadastros</span>
              <span className={`text-2xl font-bold ${totalCadastros >= 3 ? 'text-green-400' : 'text-white'}`}>
                {Math.min(totalCadastros, 3)}/3
              </span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${totalCadastros >= 3 ? 'bg-green-500' : 'bg-blue-500'}`}
                style={{ width: `${(Math.min(totalCadastros, 3) / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Vendas Progress */}
          <div>
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-slate-300 font-medium">Vendas</span>
              <span className={`text-2xl font-bold ${totalVendas >= 3 ? 'text-green-400' : 'text-white'}`}>
                {Math.min(totalVendas, 3)}/3
              </span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${totalVendas >= 3 ? 'bg-green-500' : 'bg-blue-500'}`}
                style={{ width: `${(Math.min(totalVendas, 3) / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {desafioCompleto && (
          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
            <p className="text-green-300 font-bold">✅ Parabéns! Você concorre ao sorteio do notebook!</p>
          </div>
        )}
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700">
          <p className="text-slate-400 text-sm font-medium mb-2">Total de Cadastros</p>
          <p className="text-4xl font-bold text-white">{totalCadastros}</p>
        </div>
        <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700">
          <p className="text-slate-400 text-sm font-medium mb-2">Total de Vendas</p>
          <p className="text-4xl font-bold text-white">{totalVendas}</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-8">
        <h3 className="text-xl font-bold text-white mb-6">Registrar Novo Cadastro</h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name and Date Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Nome do Consultor
              </label>
              <input
                type="text"
                name="nomeConsultor"
                value={formData.nomeConsultor}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-600 bg-slate-700/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nome completo"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Data do Cadastro
              </label>
              <input
                type="date"
                name="dataCadastro"
                value={formData.dataCadastro}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-600 bg-slate-700/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Comprovação (PDF, JPG ou PNG)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                name="comprovacao"
                onChange={handleChange}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                className="flex-1 px-4 py-3 border border-slate-600 bg-slate-700/30 rounded-lg text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {fileUploaded && (
                <span className="text-green-400 text-sm font-medium">✓ {fileName}</span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-2">Máx 10MB</p>
          </div>

          {/* Venda Checkbox */}
          <div className="flex items-center gap-3 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
            <input
              type="checkbox"
              name="fezVenda"
              checked={formData.fezVenda}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label className="font-medium text-slate-300">
              Já fez a primeira venda?
            </label>
          </div>

          {/* Venda Date */}
          {formData.fezVenda && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Data da Venda
              </label>
              <input
                type="date"
                name="dataVenda"
                value={formData.dataVenda}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-600 bg-slate-700/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          )}

          {/* Messages */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-300 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {loading ? "Salvando..." : "Salvar Cadastro"}
          </button>
        </form>
      </div>

      {/* Listings Section */}
      {totalCadastros > 0 && (
        <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-8">
          <h3 className="text-xl font-bold text-white mb-6">
            Meus Cadastros ({totalCadastros})
          </h3>
          <div className="space-y-3">
            {cadastros.map((cadastro) => (
              <div
                key={cadastro.id}
                className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors border border-slate-600"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-white">
                    {cadastro.nomeConsultor}
                  </h4>
                  <div className="flex gap-4 mt-2 text-sm text-slate-400">
                    <span>📅 {new Date(cadastro.dataCadastro).toLocaleDateString("pt-BR")}</span>
                    {cadastro.venda && (
                      <span className="text-green-400">✅ Venda: {new Date(cadastro.venda.dataVenda).toLocaleDateString("pt-BR")}</span>
                    )}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  cadastro.status === "PENDENTE"
                    ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                    : cadastro.status === "VALIDADO"
                      ? "bg-green-500/20 text-green-300 border border-green-500/30"
                      : "bg-red-500/20 text-red-300 border border-red-500/30"
                }`}>
                  {cadastro.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
