"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";

export default function PrescriptionCreate() {
  const router = useRouter();

  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [file, setFile] = useState<Blob>();
  const [error, setError] = useState<string | unknown>('');

  useEffect(() => {
    fetch('http://localhost:3001/prescriptions', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': sessionStorage.getItem("token") || ''
      }
    })
      .then(response => response.json())
      .then(data => setPrescriptions(data))
      .catch(err => setError(err));
  }, []);

  const uploadPrescription = async (id: string) => {
    try {
      const formData = new FormData();
      if (file) formData.append("file", file);

      const res = await fetch('http://localhost:3001/prescriptions/uploadPrescription/' + id, {
        method: 'POST',
        headers: { 'Authorization': sessionStorage.getItem("token") || '' },
        body: formData
      });

      if (!res.ok) throw new Error(await res.text());
      router.push('/prescription/upload');
    } catch (err) {
      setError(err);
    }
  };

  const showFile = async (id: string) => {
    try {
      const res = await fetch('http://localhost:3001/prescriptions/readPrescription/' + id, {
        method: 'GET',
        headers: { 'Authorization': sessionStorage.getItem("token") || '' },
      });

      if (!res.ok) throw new Error(await res.text());

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = id + ".pdf";
      link.click();
    } catch (err) {
      setError(err);
    }
  };

  const generatePrescription = async (id: string) => {
    try {
      const res = await fetch('http://localhost:3001/prescriptions/generatePrescription/' + id, {
        method: 'GET',
        headers: { 'Authorization': sessionStorage.getItem("token") || '' },
      });

      if (!res.ok) throw new Error(await res.text());
      const content = await res.json();
      if (content._id) window.location.reload();
      else setError(content.error);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <Link className="mb-6 font-medium text-blue-600 hover:underline self-start" href="/home">
        Voltar
      </Link>

      <div className="w-full max-w-6xl bg-white shadow-md rounded-2xl p-6 overflow-x-auto">
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">{error.toString()}</div>
        )}

        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-slate-300 px-4 py-2 min-w-[160px]">Data / Hora</th>
              <th className="border border-slate-300 px-4 py-2 min-w-[150px]">Medicamento</th>
              <th className="border border-slate-300 px-4 py-2 min-w-[120px]">Dosagem</th>
              <th className="border border-slate-300 px-4 py-2 min-w-[150px]">Instruções</th>
              <th className="border border-slate-300 px-4 py-2 min-w-[150px]">Arquivo</th>
              <th className="border border-slate-300 px-4 py-2 min-w-[180px]">Ações</th>
            </tr>
          </thead>

          <tbody>
            {prescriptions.map((prescription) => (
              <tr key={prescription._id} className="hover:bg-gray-50">
                <td className="border border-slate-300 px-4 py-2 min-w-[160px]">
                  {new Date(prescription.date).toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="border border-slate-300 px-4 py-2 text-center">{prescription.medicine}</td>
                <td className="border border-slate-300 px-4 py-2 text-center">{prescription.dosage}</td>
                <td className="border border-slate-300 px-4 py-2 text-center">{prescription.instructions}</td>

                {!prescription.file ? (
                  <>
                    <td className="border border-slate-300 px-4 py-2 text-center">
                      <input type="file" onChange={(e) => setFile(e.target.files?.[0])} />
                    </td>
                    <td className="border border-slate-300 px-4 py-2 text-center flex justify-center gap-2">
                      <button
                        onClick={() => uploadPrescription(prescription._id)}
                        className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition"
                      >
                        Upload
                      </button>
                      <button
                        onClick={() => generatePrescription(prescription._id)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                      >
                        Gerar
                      </button>
                    </td>
                  </>
                ) : (
                  <td className="border border-slate-300 px-4 py-2 text-center" colSpan={2}>
                    <button
                      onClick={() => showFile(prescription._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                    >
                      Ver Arquivo
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
