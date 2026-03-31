"use client";

import { useEffect, useState } from "react";

interface Cadastro {
  id: string;
  nomeConsultor: string;
  dataCadastro: string;
  status: string;
  regional: {
    id: string;
    name: string;
  };
  venda?: {
    id: string;
    dataVenda: string;
    status: string;
  } | null;
}

interface RankingItem {
  regional: string;
  regionalId: string;
  cadastros: number;
  vendas: number;
  conversao: number;
  elegivel: boolean;
}

export default function LiderDashboard() {
  const [cadastros, setCadastros] = useState<Cadastro[]>([]);
  const [ranking, setRanking] = useState<RankingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ranking" | "validacao">("ranking");
  const [validatingId, setValidatingId] = useState<string | null>(null);

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

        // Calculate ranking
        const rankingMap = new Map<string, RankingItem>();

        data.forEach((cadastro: Cadastro) => {
          const regionalId = cadastro.regional.id;
          const regionalName = cadastro.regional.name;

          if (!rankingMap.has(regionalId)) {
            rankingMap.set(regionalId, {
              regional: regionalName,
              regionalId,
              cadastros: 0,
              vendas: 0,
              conversao: 0,
              elegivel: false,
            });
          }

          const item = rankingMap.get(regionalId)!;
          item.cadastros += 1;

          if (cadastro.venda) {
            item.vendas += 1;
          }

          item.conversao = Math.round((item.vendas / item.cadastros) * 100) || 0;
          item.elegivel = item.cadastros >= 3 && item.vendas >= 3;
        });

        setRanking(
          Array.from(rankingMap.values()).sort(
            (a, b) => b.cadastros - a.cadastros
          )
        );
      }
    } catch (error) {
      console.error("Erro ao buscar cadastros:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (cadastroId: string, approve: boolean) => {
    setValidatingId(cadastroId);
    try {
      const res = await fetch("/api/validacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cadastroId,
          status: approve ? "APROVADO" : "REJEITADO",
        }),
      });

      if (res.ok) {
        fetchCadastros();
      }
    } catch (error) {
      console.error("Erro ao validar:", error);
    } finally {
      setValidatingId(null);
    }
  };

  const pendingCadastros = cadastros.filter((c) => c.status === "PENDENTE");

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <p className="text-white">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">Painel de Liderança</h1>
          <p className="text-slate-400">Acompanhe e valide o desempenho da equipe</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-slate-800/50 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab("ranking")}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              activeTab === "ranking"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Ranking
          </button>
          <button
            onClick={() => setActiveTab("validacao")}
            className={`px-6 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${
              activeTab === "validacao"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Validações
            {pendingCadastros.length > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {pendingCadastros.length}
              </span>
            )}
          </button>
        </div>

        {/* Ranking Tab */}
        {activeTab === "ranking" && (
          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Desempenho por Regional</h2>

            {ranking.length === 0 ? (
              <p className="text-slate-400 text-center py-8">Nenhum cadastro ainda</p>
            ) : (
              <div className="space-y-3">
                {ranking.map((item, idx) => (
                  <div
                    key={item.regionalId}
                    className={`border rounded-lg p-5 transition-colors ${
                      item.elegivel
                        ? 'bg-green-500/10 border-green-500/50 hover:bg-green-500/15'
                        : 'bg-slate-700/30 border-slate-600 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm ${
                          item.elegivel ? 'bg-green-600' : 'bg-blue-600'
                        }`}>
                          {idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-white">{item.regional}</p>
                            {item.elegivel && (
                              <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full font-bold">
                                🏆 SORTEIO
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-slate-800 rounded-lg p-4 text-center">
                        <p className="text-slate-400 text-sm mb-1">Cadastros</p>
                        <p className="text-2xl font-bold text-blue-400">{item.cadastros}</p>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-4 text-center">
                        <p className="text-slate-400 text-sm mb-1">Vendas</p>
                        <p className="text-2xl font-bold text-green-400">{item.vendas}</p>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-4 text-center">
                        <p className="text-slate-400 text-sm mb-1">Conversão</p>
                        <p className="text-2xl font-bold text-cyan-400">{item.conversao}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Validação Tab */}
        {activeTab === "validacao" && (
          <div className="space-y-4">
            {pendingCadastros.length === 0 ? (
              <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-8 text-center">
                <p className="text-slate-400">✅ Todos os cadastros foram validados!</p>
              </div>
            ) : (
              pendingCadastros.map((cadastro) => (
                <div
                  key={cadastro.id}
                  className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">
                        {cadastro.nomeConsultor}
                      </h3>
                      <p className="text-slate-400 text-sm mb-3">
                        Regional: {cadastro.regional.name}
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm">
                        <div>
                          <p className="text-slate-500">Cadastrado</p>
                          <p className="text-white font-medium">
                            {new Date(cadastro.dataCadastro).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                        {cadastro.venda && (
                          <div>
                            <p className="text-slate-500">Primeira Venda</p>
                            <p className="text-green-400 font-medium">
                              ✅ {new Date(cadastro.venda.dataVenda).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleValidate(cadastro.id, true)}
                        disabled={validatingId === cadastro.id}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white font-medium rounded-lg transition-colors text-sm"
                      >
                        ✓ Aprovar
                      </button>
                      <button
                        onClick={() => handleValidate(cadastro.id, false)}
                        disabled={validatingId === cadastro.id}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-600 text-white font-medium rounded-lg transition-colors text-sm"
                      >
                        ✕ Rejeitar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
