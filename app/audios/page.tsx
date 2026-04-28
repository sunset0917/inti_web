"use client";

import Link from "next/link";

export default function Home() {
  // Datos simulados
  const cuentos = [
    { id: 1, titulo: "El León y el Ratón", duracion: "3 min" },
    { id: 2, titulo: "La Tortuga y la Liebre", duracion: "4 min" },
    { id: 3, titulo: "El Niño Generoso", duracion: "5 min" },
    { id: 4, titulo: "Caperucita Roja", duracion: "6 min" },
    { id: 5, titulo: "Blancanieves", duracion: "6 min" },
    { id: 6, titulo: "El Gato con Botas", duracion: "6 min" },
  ];

  const frases = [
    { id: 1, texto: "Hola" },
    { id: 2, texto: "Adios" },
    { id: 3, texto: "Muy Bien" },
    { id: 4, texto: "Gracias" },
    { id: 5, texto: "Intentémoslo de nuevo" },
    { id: 6, texto: "Tú puedes" },
    { id: 7, texto: "Estoy orgulloso" },
  ];

  const recurrentes = [
    { id: 1, texto: "Hola" },
    { id: 2, texto: "Adios" },
    { id: 3, texto: "Muy Bien" },
    { id: 4, texto: "Gracias" },
  ];

  const reproducirAudio = (texto: string): void => {
  alert(`Reproduciendo: ${texto}`);
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

      {/* Cuentos */}
      <div>
        <h2 className="text-xl font-bold mb-3 text-black dark:text-white">
          Cuentos
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {cuentos.map((cuento) => (
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

      {/* Frases debajo */}
      <div>
        <h2 className="text-xl font-bold mb-3 text-black dark:text-white">
          Frases
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {frases.map((frase) => (
            <div
              key={frase.id}
              onClick={() => reproducirAudio(frase.texto)}
              className="p-4 rounded-2xl bg-white dark:bg-zinc-900 shadow cursor-pointer hover:scale-[1.02] transition"
            >
              <p>{frase.texto}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  </div>

      {/* FRASES RECURRENTES FIJAS */}
      <div className="fixed bottom-20 left-0 w-full px-4 z-50">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-4">
          <h2 className="text-lg font-bold mb-3 text-center">
            Frases Recurrentes
          </h2>

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

      {/* Barra navegación */}
      <div className="w-full fixed bottom-0 left-0 p-4 bg-white dark:bg-black flex justify-around items-center z-50">
        <Link href="/control" className="botones_web">
          Control
        </Link>

        <Link href="/audios" className="botones_web">
          Audios
        </Link>

        <Link href="/configuracion" className="botones_web">
          Config
        </Link>

        <Link href="/movimiento" className="botones_web">
          Movimiento
        </Link>
      </div>
    </>
  );
}