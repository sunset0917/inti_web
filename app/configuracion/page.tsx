"use client";

import Image from "next/image";
import Link from "next/link";
import { db } from "../firebase/firebase.js";
import { ref, set } from "firebase/database";

export default function Home() {

  function setFeliz() {
    set(ref(db, "expresiones"), 0);
  }

  function setCansado() {
    set(ref(db, "expresiones"), 1);

  }
  function setEmocionado() {
    set(ref(db, "expresiones"), 2);
  }

  return (
    // 1. Usamos un Fragmento (<>) para devolver dos elementos hermanos.
    <>
      {/* 2. Este es el contenedor del contenido principal.
             YA NO CONTIENE la barra de navegación.
             También eliminamos 'relative' y 'z-0' porque ya no son necesarios. */}
      <div className="min-h-screen w-full bg-zinc-50 dark:bg-black flex flex-col items-start p-12 pb-32">
        
        {/* Título */}
        <h1 className="titulos_subpaginas">
          Configuración
        </h1>

        <h2 className="subtitulos_subpaginas">
          Expresiones faciales
        </h2>

        {/* Botones de expresiones */}
        {/* El z-index aquí es opcional ahora, pero no hace daño mantenerlo */}
        <div className="flex gap-4 mt-4 z-[10] relative">
          <button
            onClick={setFeliz}
            className="px-12 py-4 rounded-xl border dark:border-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition font-medium min-w-[150px]">
          
            Feliz
          </button>
          <button
          onClick={setCansado}
            className="px-12 py-4 rounded-xl border dark:border-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition font-medium min-w-[150px]">
            Cansado
          </button>

          <button
          onClick={setEmocionado}
            className="px-12 py-4 rounded-xl border dark:border-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition font-medium min-w-[150px]">
            Emocionado
          </button>
        </div>

        <h2 className="subtitulos_subpaginas">
          Volumen
        </h2>
        
        <h2 className="subtitulos_subpaginas">
          Batería
        </h2>
      </div>

      {/* 3. La barra de navegación ahora es HERMANA del div de contenido. */}
      {/*    Ahora se posicionará correctamente con respecto a la ventana. */}
      <div className="w-full fixed bottom-0 left-0 p-4 bg-white dark:bg-black flex justify-around items-center z-50">
        <Link
          href="/control"
          className="botones_web"
        >
          Control de Dispositivo
        </Link>
        <Link
          href="/audios"
          className="botones_web"
        >
          Audios
        </Link>
        <Link
          href="/configuracion"
          className="botones_web"
        >
          Configuracion
        </Link>
        <Link
          href="/movimiento"
          className="botones_web"
        >
          Movimiento
        </Link>
      </div>
    </>
  );
}
