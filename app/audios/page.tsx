"use client";

import Link from "next/link";
import FrasesRecurrentes from "../components/Frases"; 
import { db } from "../firebase/firebase.js";
import { ref, set } from "firebase/database";
export default function Home() {
  // Datos simulados
  const doctor = [
    { id: 1, titulo: "El León y el Ratón", duracion: "3 min" },
    { id: 2, titulo: "La Tortuga y la Liebre", duracion: "2 min" },
    { id: 3, titulo: "El Niño Generoso", duracion: "3 min" },
    { id: 4, titulo: "Caperucita Roja", duracion: "2 min" },
    { id: 5, titulo: "Blancanieves", duracion: "2 min" },
    { id: 6, titulo: "El Gato con Botas", duracion: "3 min" },
  ];

  const paciente = [
    { id: 1, texto: "Hola", audio: "hola" },
    { id: 2, texto: "Adios", audio: "adios" },
    { id: 3, texto: "Muy Bien" ,audio: "muy_bien"},
    { id: 4, texto: "Gracias",audio:"gracias" },
    { id: 5, texto: "Si" ,audio:"si"},
    { id: 6, texto: "No", audio:"si" },
    { id: 7, texto: "Tal vez" , audio:"tal_vez"},
    { id: 8, texto: "Intentémoslo de nuevo" ,audio:"de_nuevo"},
    { id: 9, texto: "Tú puedes",audio:"tu_puedes" },
    { id: 10, texto: "Estoy orgulloso",audio:"orgulloso" },
  ];

  
  const reproducirAudio = async (audio: string) => {
    await set(ref(db, "audio"), {
      nombre: audio.toLowerCase(),
      timestamp: Date.now(),
    });
  
  };
  
  return (
    <>
      <div className="min-h-screen w-full bg-zinc-50 dark:bg-black p-6 pb-40">
  {/* Título */}
  <h1 className="titulos_subpaginas mb-6">
    Audios
  </h1>

    {/* CONTENIDO EN UNA SOLA COLUMNA */}
    <div className="flex flex-col gap-8">

      {/* Frases debajo */}
      <div>
        <h2 className="text-xl font-bold mb-3 text-black dark:text-white">
          Frases
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {paciente.map((frase) => (
            <div
              key={frase.id}
              onClick={() => reproducirAudio(frase.audio)}
              className="p-4 rounded-2xl bg-white dark:bg-zinc-900 shadow cursor-pointer hover:scale-[1.02] transition"
            >
              <p>{frase.texto}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Cuentos */}
      <div>
        <h2 className="text-xl font-bold mb-3 text-black dark:text-white">
          Cuentos
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {doctor.map((cuento) => (
            <div
              key={cuento.id}
              onClick={() => reproducirAudio(cuento.titulo)}
              className="p-4 rounded-2xl bg-white dark:bg-zinc-900 shadow cursor-pointer hover:scale-[1.02] transition"
            >
              <p className="font-semibold">{cuento.titulo}</p>
              <p className="text-sm opacity-70">{cuento.duracion}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  </div>
      
      
      <FrasesRecurrentes />

      {/* Barra navegación */}
      
      <div className="w-full fixed bottom-0 left-0 p-4 bg-white dark:bg-black flex justify-around items-center">
        
        <Link href="/movimiento" className="botones_web">
          Movimiento
        </Link>

        <Link href="/audios" className="botones_web">
          Audios
        </Link>

        <Link href="/terapia" className="botones_web">
          Terapia
        </Link>

        <Link href="/configuracion" className="botones_web">
          Configuracion
        </Link>
      </div>
    </>
  );
}
