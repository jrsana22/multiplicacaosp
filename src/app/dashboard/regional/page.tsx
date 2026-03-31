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
          comprovacao: fileUploaded ? fileName : undefined,
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

  // Desafio: 3 cadastros + 3 vendas
  const desafioCompleto = totalCadastros >= 3 && totalVendas >= 3;
  const progressoCadastros = Math.min(totalCadastros, 3);
  const progressoVendas = Math.min(totalVendas, 3);

  return (
    <div className="space-y-6">
      {/* Banner de Desafio */}
      <div className={`rounded-lg shadow-lg p-6 text-white ${desafioCompleto ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-orange-500 to-red-600'}`}>
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-black mb-2">🎯 DESAFIO DO MÊS</h3>
              <p className="text-lg font-bold opacity-90">3 Cadastros + 3 Vendas = SORTEIO DO NOTEBOOK!</p>
            </div>
            <div className="text-5xl">
              {desafioCompleto ? '🏆' : '⚡'}
            </div>
          </div>

          {/* Barra de Progresso - Cadastros */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-bold">📋 Cadastros</span>
              <span className="font-black text-lg">{progressoCadastros}/3</span>
            </div>
            <div className="bg-white/20 rounded-full h-4 overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-500 rounded-full"
                style={{ width: `${(progressoCadastros / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Barra de Progresso - Vendas */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-bold">💰 Vendas</span>
              <span className="font-black text-lg">{progressoVendas}/3</span>
            </div>
            <div className="bg-white/20 rounded-full h-4 overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-500 rounded-full"
                style={{ width: `${(progressoVendas / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Status */}
          <div className="text-center pt-2">
            {desafioCompleto ? (
              <p className="text-2xl font-black">✅ PARABÉNS! VOCÊ CONCORRE AO SORTEIO! 🎉</p>
            ) : (
              <p className="text-lg">
                Faltam{' '}
                {3 - progressoCadastros > 0 && `${3 - progressoCadastros} cadastro${3 - progressoCadastros > 1 ? 's' : ''}`}
                {3 - progressoCadastros > 0 && 3 - progressoVendas > 0 && ' e '}
                {3 - progressoVendas > 0 && `${3 - progressoVendas} venda${3 - progressoVendas > 1 ? 's' : ''}`}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Contador */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
          <div className="text-sm font-medium opacity-90">Cadastros</div>
          <div className="text-4xl font-bold mt-2">{totalCadastros}</div>
          <div className="text-xs opacity-75 mt-1">Novos consultores</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
          <div className="text-sm font-medium opacity-90">Vendas</div>
          <div className="text-4xl font-bold mt-2">{totalVendas}</div>
          <div className="text-xs opacity-75 mt-1">Primeiras vendas</div>
        </div>
      </div>

      {/* Formulário */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-6 text-gray-900">📝 Novo Cadastro</h2>

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

          {/* Upload de comprovação */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📎 Comprovação (Cabeçalho do contrato, PDF ou foto)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                name="comprovacao"
                onChange={handleChange}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {fileUploaded && (
                <span className="text-green-600 font-medium text-sm">✓ {fileName}</span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Máx 10MB. Formatos: PDF, JPG, PNG, DOC
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              name="fezVenda"
              checked={formData.fezVenda}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label className="text-sm font-medium text-gray-700">
              ✅ Fez a primeira venda?
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
            {loading ? "Salvando..." : "💾 Salvar Cadastro"}
          </button>
        </form>
      </div>

      {/* Listagem de cadastros */}
      {totalCadastros > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold mb-4 text-gray-900">
            Meus Cadastros ({totalCadastros})
          </h2>
          <div className="space-y-3">
            {cadastros.map((cadastro) => (
              <div
                key={cadastro.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">
                      {cadastro.nomeConsultor}
                    </h4>
                    <p className="text-sm text-gray-600">
                      📅 Cadastrado em{" "}
                      {new Date(cadastro.dataCadastro).toLocaleDateString("pt-BR")}
                    </p>
                    {cadastro.venda && (
                      <p className="text-sm text-green-700 font-medium">
                        ✅ Venda em{" "}
                        {new Date(cadastro.venda.dataVenda).toLocaleDateString("pt-BR")}
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      cadastro.status === "PENDENTE"
                        ? "bg-yellow-100 text-yellow-800"
                        : cadastro.status === "VALIDADO"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {cadastro.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-3">ℹ️ Como funciona?</h3>
        <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
          <li>Preencha o nome do novo consultor cadastrado</li>
          <li>Informe a data em que foi cadastrado</li>
          <li>Anexe o cabeçalho do contrato ou comprovante de adesão como PDF ou foto</li>
          <li>Se já fez a primeira venda, marque e informe a data</li>
          <li>O líder de estado verá todos os registros em tempo real</li>
          <li>⚠️ REGRA: Não vale o próprio veículo como venda!</li>
          <li>✅ Cadastre 3 novos + ajude 3 a vender = CONCORRE AO NOTEBOOK!</li>
        </ul>
      </div>

      {/* Motivação */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg p-6 text-white text-center space-y-3">
        <p className="text-lg font-bold">Quem multiplica, cresce.</p>
        <p className="text-lg font-bold">Quem cresce, lidera.</p>
        <p className="text-lg font-bold">Quem lidera, domina o jogo.</p>
        <p className="text-2xl font-black mt-4">👉 ESSE MÊS É PRA MULTIPLICAR! 💪</p>
      </div>
    </div>
  );
}
