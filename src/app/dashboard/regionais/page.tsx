"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Regional {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  cadastros: number;
}

export default function RegionaisPage() {
  const router = useRouter();
  const [regionais, setRegionais] = useState<Regional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRegionais = async () => {
      try {
        const res = await fetch("/api/admin/regionais");
        if (!res.ok) {
          if (res.status === 403) {
            router.push("/dashboard");
            return;
          }
          throw new Error("Erro ao buscar regionais");
        }
        const data = await res.json();
        setRegionais(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRegionais();
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
          <h1 className="text-3xl font-bold text-white">Regionais Cadastrados</h1>
          <p className="text-slate-300 mt-2">Total: {regionais.length} regionais</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {regionais.length === 0 ? (
        <div className="bg-slate-800 rounded-lg p-8 text-center">
          <p className="text-slate-400">Nenhum regional cadastrado ainda</p>
        </div>
      ) : (
      <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-slate-200">Nome</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-200">Email</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-200">Data de Cadastro</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-200">Consultores</th>
                <th className="px-6 py-3 text-right font-semibold text-slate-200">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {regionais.map((regional) => (
                <tr key={regional.id} className="hover:bg-slate-700 transition-colors">
                  <td className="px-6 py-3 text-slate-100 font-semibold">{regional.name}</td>
                  <td className="px-6 py-3 text-slate-300">{regional.email}</td>
                  <td className="px-6 py-3 text-slate-300">
                    {new Date(regional.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-6 py-3">
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-900 text-blue-200">
                      {regional.cadastros}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button className="text-red-400 hover:text-red-300 text-lg transition-colors" title="Deletar">
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}
    </div>
  );
}
