"use client";

import { useEffect, useState } from "react";

interface Cadastro {
  id: string;
  nomeConsultor: string;
  dataCadastro: string;
  status: string;
  venda?: {
    dataVenda: string;
    status: string;
  } | null;
  regional: {
    id: string;
    name: string;
    email: string;
  };
}

interface RankingItem {
  regional: string;
  regionalId: string;
  cadastros: number;
  vendas: number;
  conversao: number;
}

export default function LiderDashboard() {
  const [cadastros, setCadastros] = useState<Cadastro[]>([]);
  const [ranking, setRanking] = useState<RankingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ranking" | "validacao">("ranking");

  useEffect(() => {
    fetchCadastros();
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
            });
          }

          const item = rankingMap.get(regionalId)!;
          item.cadastros += 1;

          if (cadastro.venda) {
            item.vendas += 1;
          }

          item.conversao =
            Math.round((item.vendas / item.cadastros) * 100) || 0;
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

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("ranking")}
          className={`px-4 py-2 font-medium ${
            activeTab === "ranking"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600"
          }`}
        >
          Ranking
        </button>
        <button
          onClick={() => setActiveTab("validacao")}
          className={`px-4 py-2 font-medium ${
            activeTab === "validacao"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600"
          }`}
        >
          Validação ({cadastros.filter((c) => c.status === "PENDENTE").length})
        </button>
      </div>

      {/* Ranking Tab */}
      {activeTab === "ranking" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Ranking</h2>
            {ranking.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Nenhum cadastro ainda
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                        Regional
                      </th>
                      <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">
                        Cadastros
                      </th>
                      <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">
                        Vendas
                      </th>
                      <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">
                        Conversão
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {ranking.map((item, idx) => (
                      <tr key={item.regionalId} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">
                          <span className="font-medium text-gray-900">
                            {idx + 1}. {item.regional}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                            {item.cadastros}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                            {item.vendas}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-sm font-semibold text-gray-900">
                            {item.conversao}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Validação Tab */}
      {activeTab === "validacao" && (
        <div className="space-y-4">
          {cadastros.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              Nenhum cadastro para validar
            </div>
          ) : (
            cadastros.map((cadastro) => (
              <div
                key={cadastro.id}
                className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-400"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">
                      {cadastro.nomeConsultor}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Regional: {cadastro.regional.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Cadastrado em:{" "}
                      {new Date(cadastro.dataCadastro).toLocaleDateString(
                        "pt-BR"
                      )}
                    </p>
                    {cadastro.venda && (
                      <p className="text-sm text-green-700">
                        ✅ Venda em:{" "}
                        {new Date(cadastro.venda.dataVenda).toLocaleDateString(
                          "pt-BR"
                        )}
                      </p>
                    )}
                    <span
                      className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${
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
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
                    Validar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
