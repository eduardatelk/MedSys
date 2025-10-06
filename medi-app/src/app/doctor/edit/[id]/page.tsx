"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function DoctorEdit() {
  const router = useRouter();
  const pathname = usePathname();

  const segments = pathname.split("/");
  const id = segments[segments.length - 1];

  const [doctor, setDoctor] = useState({
    name: "",
    login: "",
    password: "",
    medicalSpecialty: "",
    medicalRegistration: "",
    email: "",
    phone: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDoctor() {
      try {
        const res = await fetch(`http://localhost:3001/doctors/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("token") || "",
          },
        });
        const data = await res.json();
        setDoctor(data);
      } catch {
        setError("Erro ao carregar médico.");
      }
    }
    fetchDoctor();
  }, [id]);

  const editDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch(`http://localhost:3001/doctors/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": sessionStorage.getItem("token") || "",
        },
        body: JSON.stringify(doctor),
      });
      const content = await res.json();

      if (content.login) {
        router.push("/home");
      } else {
        setError(content.error);
      }
    } catch {
      setError("Erro ao atualizar médico.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-bold text-indigo-500">Editar Médico</h1>
          <Link href="/doctor/list" className="text-blue-600 hover:underline">
            Voltar
          </Link>
        </div>

        {/* Mensagem de erro */}
        {error && (
          <div className="mb-4 p-2 bg-red-400 text-white rounded-md font-medium">
            {error}
          </div>
        )}

        {/* Formulário */}
        <form className="flex flex-col gap-3" onSubmit={editDoctor}>
          {[
            { label: "Nome", key: "name" },
            { label: "Login", key: "login" },
            { label: "Senha", key: "password", type: "password" },
            { label: "Especialidade Médica", key: "medicalSpecialty" },
            { label: "Registro Médico", key: "medicalRegistration" },
            { label: "Email", key: "email" },
            { label: "Telefone", key: "phone" },
          ].map((field) => (
            <input
              key={field.key}
              type={field.type || "text"}
              placeholder={field.label}
              value={(doctor as any)[field.key]}
              onChange={(e) =>
                setDoctor({ ...doctor, [field.key]: e.target.value })
              }
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
            />
          ))}

          <button
            type="submit"
            className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md transition-all duration-200"
          >
            Atualizar Médico
          </button>
        </form>
      </div>
    </main>
  );
}
