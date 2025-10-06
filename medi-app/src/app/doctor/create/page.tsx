"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function DoctorCreate() {
    const router = useRouter();

    const [name, setName] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [medicalSpeciality, setMedicalSpecialty] = useState('');
    const [medicalRegistration, setMedicalRegistration] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState<string | null>(null);

    const addDoctor = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!name || !login || !password || !medicalSpeciality || !medicalRegistration || !email || !phone) {
            setError("Todos os campos são obrigatórios.");
            return;
        }

        const formData = { name, login, password, medicalSpeciality, medicalRegistration, email, phone };

        try {
            const res = await fetch("http://localhost:3001/doctors", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": sessionStorage.getItem("token") || "",
                },
                body: JSON.stringify(formData),
            });

            const content = await res.json();

            if (content.login) {
                router.push("/home");
            } else {
                setError(content.error);
            }
        } catch {
            setError("Erro ao criar médico.");
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">
                {/* Cabeçalho */}
                <div className="flex justify-between items-center mb-5">
                    <h1 className="text-2xl font-bold text-indigo-500">Criar Médico</h1>
                    <Link href="/home" className="text-blue-600 hover:underline">Voltar</Link>
                </div>

                {/* Mensagem de erro */}
                {error && <div className="mb-4 p-2 bg-red-400 text-white rounded-md font-medium">{error}</div>}

                {/* Formulário */}
                <form className="flex flex-col gap-3" onSubmit={addDoctor}>
                    <input
                        type="text"
                        placeholder="Nome"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                    />
                    <input
                        type="text"
                        placeholder="Login"
                        value={login}
                        onChange={e => setLogin(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                    />
                    <input
                        type="text"
                        placeholder="Especialidade Médica"
                        value={medicalSpeciality}
                        onChange={e => setMedicalSpecialty(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                    />
                    <input
                        type="text"
                        placeholder="Registro Médico"
                        value={medicalRegistration}
                        onChange={e => setMedicalRegistration(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                    />
                    <input
                        type="tel"
                        placeholder="Telefone"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                    />

                    <button
                        type="submit"
                        className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md transition-all duration-200"
                    >
                        Criar Médico
                    </button>
                </form>
            </div>
        </main>
    );
}
