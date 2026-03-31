"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Cadastro {
  id: string;
  nomeConsultor: string;
  dataCadastro: string;
  status: string;
  regional: {
    name: string;
    email: string;
  };
  venda?: {
    id: string;
    status: string;
  };
  createdAt: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [cadastros, setCadastros] = useState<Cadastro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCadastros = async () => {
      try {
        const res = await fetch("/api/admin/cadastros");
        if (!res.ok) {
          if (res.status === 403) {
            router.push("/dashboard");
            return;
          }
          throw new Error("Erro ao buscar cadastros");
        }
        const data = await res.json();
        setCadastros(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCadastros();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-slate-600">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Todos os Cadastros</h1>
          <p className="text-slate-300 mt-2">Total: {cadastros.length} cadastros</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-slate-200">Consultor</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-200">Regional</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-200">Data Cadastro</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-200">Status</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-200">Venda</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {cadastros.map((cadastro) => (
                <tr key={cadastro.id} className="hover:bg-slate-700 transition-colors">
                  <td className="px-6 py-3 text-slate-100">{cadastro.nomeConsultor}</td>
                  <td className="px-6 py-3 text-slate-300">
                    <div>{cadastro.regional.name}</div>
                    <div className="text-xs text-slate-500">{cadastro.regional.email}</div>
                  </td>
                  <td className="px-6 py-3 text-slate-300">
                    {new Date(cadastro.dataCadastro).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        cadastro.status === "VALIDADO"
                          ? "bg-green-900 text-green-200"
                          : cadastro.status === "REJEITADO"
                          ? "bg-red-900 text-red-200"
                          : "bg-yellow-900 text-yellow-200"
                      }`}
                    >
                      {cadastro.status}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    {cadastro.venda ? (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          cadastro.venda.status === "VALIDADO"
                            ? "bg-green-900 text-green-200"
                            : cadastro.venda.status === "REJEITADO"
                            ? "bg-red-900 text-red-200"
                            : "bg-yellow-900 text-yellow-200"
                        }`}
                      >
                        {cadastro.venda.status}
                      </span>
                    ) : (
                      <span className="text-slate-500">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
