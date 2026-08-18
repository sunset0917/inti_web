"use client";

import Link from "next/link";
import FrasesRecurrentes from "../components/Frases"; 
import { db } from "../firebase/firebase.js";
import { ref, set } from "firebase/database";
export default function Home() {
  // Datos simulados
  const doctor = [
    { id: 1, titulo: "¿Cómo late tu corazón?",audio: "doctor_corazon" },
    { id: 2, titulo: "¿Cómo estarán tus ojos?",audio: "doctor_ojos" },
    { id: 3, titulo: "¿Cómo estarán tus oídos?",audio: "doctor_oido" },
    { id: 4, titulo: "¿Cómo estarán tus dientes?",audio: "doctor_dientes" },
    { id: 5, titulo: "¿Tendrás fiebre?",audio: "doctor_fiebre" },
    { id: 6, titulo: "Con lo que hemos aprendido, te dejarás curar por los médicos",audio: "dejar_curar_doctor" },
    { id: 7, titulo: "Eres valiente y vas a recuperarte",audio: "valiente" },
    { id: 8, titulo: "Nos veremos en otra ocasión",audio: "otra_ocasion" },
  ];

  const paciente = [
    { id: 1, texto: "Doctor, ¿cómo está mi corazón?",audio: "paciente_corazon" },
    { id: 2, texto: "Doctor, ¿cómo están mis ojos?",audio: "paciente_ojos" },
    { id: 3, texto: "Doctor, ¿cómo están mis oídos?",audio: "paciente_oidos" },
    { id: 4, texto: "Doctor, ¿cómo están mi boca?",audio: "paciente_boca" },
    { id: 5, texto: "Doctor, ¿cómo están mis heridas de quemadura?",audio: "paciente_quemadura" },
    { id: 6, texto: "Doctor, entonces ¿la curación me ayuda a estar mejor?",audio: "paciente_curacion" },
    { id: 7, texto: "Ahora yo me voy a dejar curar para sanar mis heridas y regresar pronto a mi casa",audio: "dejar_curar_heridas" },
    { id: 8, texto: "Nos veremos en otra ocasión",audio: "otra_ocasion" },
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
    Terapia
  </h1>

    {/* CONTENIDO EN UNA SOLA COLUMNA */}
    <div className="flex flex-col gap-8">

      {/* Frases debajo */}
      <div>
        <h2 className="text-xl font-bold mb-3 text-black dark:text-white">
          Juego: Cuando Inti es paciente
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
          Juego: Cuando Inti es doctor
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {doctor.map((cuento) => (
            <div
              key={cuento.id}
              onClick={() => reproducirAudio(cuento.audio)}
              className="p-4 rounded-2xl bg-white dark:bg-zinc-900 shadow cursor-pointer hover:scale-[1.02] transition"
            >
              <p>{cuento.titulo}</p>
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