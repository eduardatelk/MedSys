"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function AppointmentList() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [pacients, setPacients] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3001/appointments", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("token") || "",
      },
    })
      .then((res) => res.json())
      .then((data) => setAppointments(data))
      .catch(() => setError("Erro ao carregar consultas"));
  }, []);

  useEffect(() => {
    fetch("http://localhost:3001/doctors", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("token") || "",
      },
    })
      .then((res) => res.json())
      .then((data) => setDoctors(data))
      .catch(() => setError("Erro ao carregar médicos"));
  }, []);

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

  const deleteAppointment = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3001/appointments/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token") || "",
        },
      });
      const content = await res.json();
      if (content.date) {
        window.location.reload();
      } else {
        setError(content.error);
      }
    } catch {
      setError("Erro ao Excluir prescrição");
    }
  };

  const findDoctorName = (id: string) =>
    doctors.find((d) => d._id === id)?.name || "Unknown";

  const findPacientName = (id: string) =>
    pacients.find((p) => p._id === id)?.name || "Unknown";

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <Link
        className="font-medium text-blue-600 dark:text-blue-500 hover:underline mb-6 inline-block"
        href="/home"
      >
        Voltar
      </Link>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {appointments.map((appointment) => (
          <div
            key={appointment._id}
            className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">
              {new Date(appointment.date).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Doctor: {findDoctorName(appointment.doctorId)}
            </p>
            <p className="text-gray-500 text-sm">
              Pacient: {findPacientName(appointment.pacientId)}
            </p>

            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <Link
                href={`/appointment/edit/${appointment._id}`}
                className="bg-yellow-500 px-3 py-2 text-white text-sm rounded-lg hover:bg-yellow-600"
              >
                Editar consulta
              </Link>
              <button
                onClick={() => deleteAppointment(appointment._id)}
                className="bg-red-500 px-3 py-2 text-white text-sm rounded-lg hover:bg-red-600"
              >
                Excluir consulta
              </button>
              <Link
                href={`/prescription/${appointment._id}/create`}
                className="bg-green-500 px-3 py-2 text-white text-sm rounded-lg hover:bg-green-600"
              >
                Incluir prescição
              </Link>
              <Link
                href="/prescription/upload"
                className="bg-green-500 px-3 py-2 text-white text-sm rounded-lg hover:bg-green-600"
              >
                Ver prescrições
              </Link>
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
