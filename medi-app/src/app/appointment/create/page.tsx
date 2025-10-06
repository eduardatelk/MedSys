"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function AppointmentCreate() {
    const router = useRouter();

    const [date, setDate] = useState('');
    const [doctorId, setDoctorId] = useState('');
    const [pacientId, setPacientId] = useState('');
    const [doctors, setDoctors] = useState<any[]>([]);
    const [pacients, setPacients] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Carregar médicos
    useEffect(() => {
        fetch('http://localhost:3001/doctors', {
            headers: { 'Authorization': sessionStorage.getItem("token") || '' }
        })
        .then(res => res.json())
        .then(data => {
            setDoctors(data);
            if (data.length) setDoctorId(data[0]._id);
        });
    }, []);

    // Carregar pacientes
    useEffect(() => {
        fetch('http://localhost:3001/pacients', {
            headers: { 'Authorization': sessionStorage.getItem("token") || '' }
        })
        .then(res => res.json())
        .then(data => {
            setPacients(data);
            if (data.length) setPacientId(data[0]._id);
        });
    }, []);

    const addAppointment = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!date || !doctorId || !pacientId) {
            setError("Todos os campos são obrigatórios.");
            return;
        }

        const formData = { date, doctorId, pacientId };

        try {
            const res = await fetch('http://localhost:3001/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionStorage.getItem("token") || ''
                },
                body: JSON.stringify(formData)
            });

            const content = await res.json();

            if (content.date) {
                router.push('/home');
            } else {
                setError(content.error);
            }
        } catch {
            setError("Erro ao criar consulta.");
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">
                {/* Cabeçalho */}
                <div className="flex justify-between items-center mb-5">
                    <h1 className="text-2xl font-bold text-indigo-500">Criar Consulta</h1>
                    <Link href="/home" className="text-blue-600 hover:underline">Voltar</Link>
                </div>

                {/* Mensagem de erro */}
                {error && <div className="mb-4 p-2 bg-red-400 text-white rounded-md font-medium">{error}</div>}

                {/* Formulário */}
                <form className="flex flex-col gap-3" onSubmit={addAppointment}>
                    <input
                        type="datetime-local"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
                    />

                    <select
                        value={doctorId}
                        onChange={e => setDoctorId(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
                    >
                        {doctors.map((doctor, i) => (
                            <option key={i} value={doctor._id}>{doctor.name}</option>
                        ))}
                    </select>

                    <select
                        value={pacientId}
                        onChange={e => setPacientId(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
                    >
                        {pacients.map((pacient, i) => (
                            <option key={i} value={pacient._id}>{pacient.name}</option>
                        ))}
                    </select>

                    <button
                        type="submit"
                        className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md transition-all duration-200"
                    >
                        Criar Consulta
                    </button>
                </form>
            </div>
        </main>
    );
}
