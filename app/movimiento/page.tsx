"use client";

import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { db } from "../firebase/firebase.js";
import { ref, set } from "firebase/database";
import FrasesRecurrentes from "../components/Frases"; 

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
    <div className="min-h-screen w-full bg-zinc-50 dark:bg-black flex flex-col p-12 pb-32">
      
      {/* Título */}
      <h1 className="titulos_subpaginas">
        Movimientos
      </h1>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="w-full flex flex-row flex-wrap items-start justify-between mt-10 px-6">

        {/* LADO IZQUIERDO -> Imagen + Flechas */}
        <div className="flex items-start gap-20">

          {/* Imagen */}
          <div className="flex justify-center items-center">
            <Image
              src="/Luna.png"
              alt="Ícono"
              width={350}
              height={350}
              className="object-contain"
            />
          </div>

          {/* Mover cabeza */}
          <div className="flex flex-col items-center gap-6">
            <h2 className="text-xl font-semibold">
              Mover cabeza
            </h2>

            {/* Flechas */}
            <div className="flex flex-col items-center gap-2">

              {/* Arriba */}
              <button
                onClick={ejecutarArriba}
                className="p-3 rounded-full border dark:border-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition"
              >
                <ArrowUp size={32} />
              </button>

              {/* Izquierda - Derecha */}
              <div className="flex gap-4">
                <button
                  onClick={ejecutarIzquierda}
                  className="p-3 rounded-full border dark:border-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition"
                >
                  <ArrowLeft size={32} />
                </button>

                <button
                  onClick={ejecutarDerecha}
                  className="p-3 rounded-full border dark:border-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition"
                >
                  <ArrowRight size={32} />
                </button>
              </div>

              {/* Abajo */}
              <button
                onClick={ejecutarAbajo}
                className="p-3 rounded-full border dark:border-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition"
              >
                <ArrowDown size={32} />
              </button>
            </div>
          </div>
        </div>

                {/* CONTENEDOR DERECHO */}
        <div className="flex-1 flex justify-center">

          {/* Acciones */}
          <div className="flex flex-col items-center gap-6">
            <h2 className="text-xl font-semibold">
              Acciones
            </h2>

            <div className="flex flex-col gap-4">

              <button
                onClick={asentir}
                className="px-12 py-4 rounded-xl border dark:border-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition font-medium min-w-[180px]"
              >
                Asentir
              </button>

              <button
                onClick={negar}
                className="px-12 py-4 rounded-xl border dark:border-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition font-medium min-w-[180px]"
              >
                Negar
              </button>

            </div>
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