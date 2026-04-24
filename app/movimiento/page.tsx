"use client";

import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { db } from "../firebase/firebase.js";
import { ref, set } from "firebase/database";

export default function Home() {

  function ejecutarDerecha() {
    set(ref(db, "movimiento"), 3);

  }

  function ejecutarIzquierda() {
    set(ref(db, "movimiento"), 4);

  }

  function ejecutarArriba() {
    set(ref(db, "movimiento"), 1);
  
  }

  function ejecutarAbajo() {
    set(ref(db, "movimiento"), 2);

  }

  function asentir() {
    set(ref(db, "movimiento"), 6);

  }

  function negar() {
    set(ref(db, "movimiento"),5);
  }

  return (
    <>
      <div className="min-h-screen w-full bg-zinc-50 dark:bg-black flex flex-col items-start p-12 pb-32">
        
        {/* Título */}
        <h1 className="titulos_subpaginas">
          Movimientos
        </h1>

        {/* CAMBIO AQUÍ: Contenedor principal ahora es flex-row para ponerlos lado a lado */}
        <div className="w-full flex flex-row flex-wrap items-start justify-center gap-60 mt-10">

          {/* === SECCIÓN 1: MOVER CABEZA === */}
          <div className="flex flex-col items-center gap-6">
            <h2 className="text-xl font-semibold">Mover cabeza</h2>

            {/* Flechas */}
            <div className="flex flex-col items-center gap-2">
              {/* Flecha arriba */}
              <button 
                onClick={ejecutarArriba}
                className="p-3 rounded-full border dark:border-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition">
                <ArrowUp size={32} />
              </button>

              {/* Izquierda - Derecha */}
              <div className="flex gap-4">
                <button 
                  onClick={ejecutarIzquierda}
                  className="p-3 rounded-full border dark:border-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition">
                  <ArrowLeft size={32} />
                </button>

                <button 
                  onClick={ejecutarDerecha}
                  className="p-3 rounded-full border dark:border-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition">
                  <ArrowRight size={32} />
                </button>
              </div>

              {/* Flecha abajo */}
              <button 
                onClick={ejecutarAbajo}
                className="p-3 rounded-full border dark:border-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition">
                <ArrowDown size={32} />
              </button>
            </div>
          </div>

          {/* === SECCIÓN 2: GESTOS RÁPIDOS (ACCIONES) === */}
          <div className="flex flex-col items-center gap-6">
            <h2 className="text-xl font-semibold">Acciones</h2>
            <div className="flex flex-col gap-4"> {/* Cambiado a col para que los botones de acciones se vean ordenados al lado */}
              


              {/* Bloque Mirar a la izquierda */}
              <button 
                onClick={ejecutarIzquierda}
                className="px-12 py-4 rounded-xl border dark:border-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition font-medium min-w-[150px]">
                Mirar a la izquierda
              </button>

              {/* Bloque Mirar a la derecha */}
              <button 
                onClick={ejecutarDerecha}
                className="px-12 py-4 rounded-xl border dark:border-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition font-medium min-w-[150px]">
                Mirar a la derecha
              </button>

              {/* Bloque Asentir */}
              <button 
                onClick={asentir}
                className="px-12 py-4 rounded-xl border dark:border-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition font-medium min-w-[150px]">
                Asentir
              </button>

              {/* Bloque Negar */}
              <button 
                onClick={negar}
                className="px-12 py-4 rounded-xl border dark:border-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition font-medium min-w-[150px]">
                Negar
              </button>

              

            </div>
          </div>

        </div> {/* Fin del contenedor horizontal */}
      </div>

      {/* Barra de navegación inferior */}
      <div className="w-full fixed bottom-0 left-0 p-4 bg-white dark:bg-black flex justify-around items-center z-50 border-t dark:border-zinc-800">
        <Link href="/control" className="botones_web">Control de Dispositivo</Link>
        <Link href="/audios" className="botones_web">Audios</Link>
        <Link href="/configuracion" className="botones_web">Configuración</Link>
        <Link href="/movimiento" className="botones_web">Movimiento</Link>
      </div>
    </>
  );
}
