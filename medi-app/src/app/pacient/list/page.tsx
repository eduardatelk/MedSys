"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function PacientList() {
  const [pacients, setPacients] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3001/pacients", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("token") || "",
      },
    })
      .then((res) => res.json())
      .then((data) => setPacients(data))
      .catch(() => setError("Erro ao carregar pacientes"));
  }, []);

  const deletePacient = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3001/pacients/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token") || "",
        },
      });
      const content = await res.json();
      if (content.name) {
        window.location.reload();
      } else {
        setError(content.error);
      }
    } catch {
      setError("Erro ao Excluir paciente");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <Link
        className="font-medium text-blue-600 dark:text-blue-500 hover:underline mb-6 inline-block"
        href="/home"
      >
        Voltar
      </Link>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pacients.map((pacient) => (
          <div
            key={pacient._id}
            className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">{pacient.name}</h2>
            <p className="text-gray-500 text-sm mt-1">
              Nascimento: {new Date(pacient.birthDate).toLocaleDateString("pt-BR")}
            </p>
            <p className="text-gray-500 text-sm">Email: {pacient.email}</p>
            <p className="text-gray-500 text-sm">Telefone: {pacient.phone}</p>

            <div className="mt-4 flex gap-2">
              <Link
                href={`/pacient/edit/${pacient._id}`}
                className="bg-yellow-500 px-3 py-2 text-white text-sm rounded-lg hover:bg-yellow-600"
              >
                Editar
              </Link>
              <button
                onClick={() => deletePacient(pacient._id)}
                className="bg-red-500 px-3 py-2 text-white text-sm rounded-lg hover:bg-red-600"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="p-2 text-white border-gray-200 border-[1px] rounded-sm bg-red-400 mt-6">
          {error}
        </div>
      )}
    </main>
  );
}
