"use client";

import Image from "next/image";
import Link from "next/link";
import { db } from "../firebase/firebase.js";
import { ref, set } from "firebase/database";
export default function Home() {

  function activarAutonomo() {
    set(ref(db, "autonomia"), 1);
  }

  function desactivarAutonomo() {
    set(ref(db, "autonomia"), 0);
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
          Control 
        </h1>
        {/* Botones de Modo Autónomo */}
        <div className="mt-8 flex flex-col gap-4 w-full max-w-sm">
          <button 
          onClick={activarAutonomo}
          className="px-12 py-4 rounded-xl border dark:border-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition font-medium min-w-[150px]">
    
          Activar modo autónomo
          </button>

          <button 
          onClick={desactivarAutonomo}
          className="px-12 py-4 rounded-xl border dark:border-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition font-medium min-w-[150px]">
            
          Desactivar modo autónomo
          </button>
        </div>

        
      </div>

      {/* 3. La barra de navegación ahora es HERMANA del div de contenido. */}
      {/*    Ahora se posicionará correctamente con respecto a la ventana. */}
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