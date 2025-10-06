"use client";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function PacientEditar() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;

    const [name, setName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPacient = async () => {
            try {
                const res = await fetch(`http://localhost:3001/pacients/${id}`, {
                    headers: {
                        "Authorization": sessionStorage.getItem("token") || "",
                    },
                });

                if (!res.ok) {
                    throw new Error("Erro ao buscar paciente");
                }

                const data = await res.json();
                setName(data.name || "");
                setBirthDate(data.birthDate?.split("T")[0] || "");
                setEmail(data.email || "");
                setPhone(data.phone || "");
            } catch {
                setError("Erro ao carregar os dados do paciente.");
            }
        };

        if (id) fetchPacient();
    }, [id]);

    const updatePacient = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!name || !birthDate || !email || !phone) {
            setError("Todos os campos são obrigatórios.");
            return;
        }

        const formData = { name, birthDate, email, phone };

        try {
            const res = await fetch(`http://localhost:3001/pacients/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": sessionStorage.getItem("token") || "",
                },
                body: JSON.stringify(formData),
            });

            const content = await res.json();

            if (res.ok) {
                router.push("/home");
            } else {
                setError(content.error || "Erro ao atualizar paciente.");
            }
        } catch {
            setError("Erro ao atualizar paciente.");
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">
                {/* Cabeçalho */}
                <div className="flex justify-between items-center mb-5">
                    <h1 className="text-2xl font-bold text-indigo-500">Editar Paciente</h1>
                    <Link href="/home" className="text-blue-600 hover:underline">
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
                <form className="flex flex-col gap-3" onSubmit={updatePacient}>
                    <input
                        type="text"
                        placeholder="Nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
                    />
                    <input
                        type="date"
                        placeholder="Nascimento"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
                    />
                    <input
                        type="tel"
                        placeholder="Telefone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
                    />

                    <button
                        type="submit"
                        className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md transition-all duration-200"
                    >
                        Atualizar Paciente
                    </button>
                </form>
            </div>
        </main>
    );
}
