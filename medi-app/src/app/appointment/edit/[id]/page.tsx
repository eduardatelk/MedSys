"use client";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function AppointmentEdit() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;

    const [date, setDate] = useState("");
    const [doctorId, setDoctorId] = useState<string>();
    const [pacientId, setPacientId] = useState<string>("");
    const [appointment, setAppointment] = useState({ date, doctorId, pacientId });
    const [doctors, setDoctors] = useState(new Array());
    const [pacients, setPacients] = useState(new Array());
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        const fetchAppointment = async () => {
            try {
                const res = await fetch(`http://localhost:3001/appointments/${id}`, {
                    headers: {
                        "Authorization": sessionStorage.getItem("token") || "",
                    },
                });

                if (!res.ok) throw new Error("Erro ao buscar consulta");

                const data = await res.json();
                setAppointment(data);
                setDate(data.date || "");
                setDoctorId(data.doctorId);
                setPacientId(data.pacientId);
            } catch {
                setError("Erro ao carregar os dados da consulta.");
            }
        };
        fetchAppointment();
    }, [id]);

    useEffect(() => {
        fetch("http://localhost:3001/doctors", {
            headers: { "Authorization": sessionStorage.getItem("token") || "" },
        })
            .then(res => res.json())
            .then(data => setDoctors(data));
    }, []);

    useEffect(() => {
        fetch("http://localhost:3001/pacients", {
            headers: { "Authorization": sessionStorage.getItem("token") || "" },
        })
            .then(res => res.json())
            .then(data => setPacients(data));
    }, []);

    const updateAppointment = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!date || !doctorId || !pacientId) {
            setError("Todos os campos são obrigatórios.");
            return;
        }

        const formData = { date, doctorId, pacientId };

        try {
            const res = await fetch(`http://localhost:3001/appointments/${id}`, {
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
                setError(content.error || "Erro ao atualizar consulta.");
            }
        } catch {
            setError("Erro ao atualizar consulta.");
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">
                {/* Cabeçalho */}
                <div className="flex justify-between items-center mb-5">
                    <h1 className="text-2xl font-bold text-indigo-500">Editar Consulta</h1>
                    <Link href="/appointment/list" className="text-blue-600 hover:underline">
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
                <form className="flex flex-col gap-3" onSubmit={updateAppointment}>
                    <input
                        type="text"
                        placeholder="Data"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
                    />

                    <select
                        value={doctorId}
                        onChange={e => setDoctorId(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
                    >
                        <option value="">Selecione o médico</option>
                        {doctors.map((doctor: any) => (
                            <option key={doctor._id} value={doctor._id}>
                                {doctor.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={pacientId}
                        onChange={e => setPacientId(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
                    >
                        <option value="">Selecione o paciente</option>
                        {pacients.map((pacient: any) => (
                            <option key={pacient._id} value={pacient._id}>
                                {pacient.name}
                            </option>
                        ))}
                    </select>

                    <button
                        type="submit"
                        className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md transition-all duration-200"
                    >
                        Atualizar Consulta
                    </button>
                </form>
            </div>
        </main>
    );
}
