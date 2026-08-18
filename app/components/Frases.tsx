"use client";

import { useState } from "react";

export default function FrasesRecurrentes() {
  const [expandido, setExpandido] = useState(false);

  const recurrentes = [
    { id: 1, texto: "Hola" },
    { id: 2, texto: "Adios" },
    { id: 3, texto: "Muy Bien" },
    { id: 4, texto: "Gracias" },
    { id: 5, texto: "Si" },
    { id: 6, texto: "No" },
  ];

  const reproducirAudio = (texto: string): void => {
    alert(`Reproduciendo: ${texto}`);
  };

  return (
    <div className="fixed bottom-20 left-0 w-full px-4 z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg overflow-hidden">

        {/* Botón */}
        <button
          onClick={() => setExpandido(!expandido)}
          className="w-full p-4 flex justify-between items-center font-bold"
        >
          <span>Frases Frecuentes</span>

          <span
            className={`transition-transform duration-300 ${
              expandido ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </button>

        {/* Contenido */}
        <div
          className={`transition-all duration-300 overflow-hidden ${
            expandido ? "max-h-96 p-4 pt-0" : "max-h-0"
          }`}
        >
          <div className="grid grid-cols-3 gap-2">
            {recurrentes.map((frase) => (
              <div
                key={frase.id}
                onClick={() => reproducirAudio(frase.texto)}
                className="p-3 text-center rounded-xl bg-zinc-100 dark:bg-zinc-800 cursor-pointer hover:scale-105 transition text-sm"
              >
                {frase.texto}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}