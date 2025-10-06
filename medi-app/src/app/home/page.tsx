"use client";

import React from "react";
import Link from "next/link";
import { User, Users, CalendarDays } from "lucide-react";

export default function Home() {
  const modules = [
    {
      title: "Médicos",
      description: "Gerenciamento de médicos cadastrados",
      hrefCreate: "/doctor/create",
      hrefList: "/doctor/list",
      icon: <User className="w-8 h-8 text-indigo-600" />,
      createButtonClass: "bg-indigo-600 hover:bg-indigo-700 text-white",
    },
    {
      title: "Pacientes",
      description: "Gerenciamento de pacientes cadastrados",
      hrefCreate: "/pacient/create",
      hrefList: "/pacient/list",
      icon: <Users className="w-8 h-8 text-emerald-600" />,
      createButtonClass: "bg-emerald-600 hover:bg-emerald-700 text-white",
    },
    {
      title: "Consultas",
      description: "Agendamento e acompanhamento de consultas",
      hrefCreate: "/appointment/create",
      hrefList: "/appointment/list",
      icon: <CalendarDays className="w-8 h-8 text-violet-600" />,
      createButtonClass: "bg-violet-600 hover:bg-violet-700 text-white",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">MedSys Dashboard</h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {modules.map((module, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-lg transition"
          >
            {module.icon}
            <h2 className="text-xl font-semibold mt-4">{module.title}</h2>
            <p className="text-gray-500 text-sm">{module.description}</p>

            <div className="mt-4 space-x-3">
              {module.hrefCreate && (
                <Link
                  href={module.hrefCreate}
                  className={`px-3 py-2 text-sm rounded-lg ${module.createButtonClass}`}
                >
                  Cadastrar
                </Link>
              )}
              {module.hrefList && (
                <Link
                  href={module.hrefList}
                  className="px-3 py-2 bg-gray-200 text-sm rounded-lg hover:bg-gray-300"
                >
                  Listar
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
