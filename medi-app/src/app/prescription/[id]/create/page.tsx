"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function PrescriptionCreate(params: any) {
  const router = useRouter();

  const [date, setDate] = useState<string>("");
  const [medicine, setMedicine] = useState<string>("");
  const [dosage, setDosage] = useState<string>("");
  const [instructions, setInstructions] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const appointmentId = params.params.id;

  const addPrescription = async (e: any) => {
    e.preventDefault();
    setError(null);

    if (date != "" && medicine != "" && dosage != "") {
      const formData = {
        date: date,
        appointmentId: appointmentId,
        medicine: medicine,
        dosage: dosage,
        instructions: instructions,
      };

      const add = await fetch("http://localhost:3001/prescriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token") || "",
        },
        body: JSON.stringify(formData),
      });

      const content = await add.json();

      if (content.date) {
        router.push("/home");
      } else {
        setError(content.error);
      }
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-bold text-indigo-500">
            Criar Prescrição
          </h1>
          <Link
            href="/appointment/list"
            className="text-blue-600 hover:underline"
          >
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
        <form className="flex flex-col gap-3" onSubmit={addPrescription}>
          <input
            type="date"
            placeholder="Data da prescrição"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
          />

          <textarea
            placeholder="Medicamento"
            value={medicine}
            onChange={(e) => setMedicine(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
          />

          <textarea
            placeholder="Dosagem"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
          />

          <textarea
            placeholder="Instruções de uso"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
          />

          <button
            type="submit"
            className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md transition-all duration-200"
          >
            Criar Prescrição
          </button>
        </form>
      </div>
    </main>
  );
}
