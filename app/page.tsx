"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [password, setPassword] = useState("");
  const [accessGranted, setAccessGranted] = useState(false);
  const [error, setError] = useState("");

  const correctPassword = "MotaTuPatrona"; // <-- cambia esto

  const handleLogin = () => {
    if (password === correctPassword) {
      setAccessGranted(true);
      setError("");
    } else {
      setError("Contraseña incorrecta");
    }
  };

  // 🔐 Pantalla de contraseña
  if (!accessGranted) {
    return (
      <div className="min-h-screen w-full bg-zinc-50 dark:bg-black flex flex-col items-center justify-center p-10">

        <Image
          src="/Luna.png"
          alt="Ícono"
          width={250}
          height={250}
          className="mb-6"
        />

        <h1 className="text-4xl font-bold text-black dark:text-white mb-8">
          INTI
        </h1>

        <div className="flex flex-col items-center gap-4 w-full max-w-sm">

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
            className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white"
          />

          <button
            onClick={handleLogin}
            className="botones_web"
          >
            Entrar
          </button>

          {error && (
            <p className="text-red-500">
              {error}
            </p>
          )}

        </div>
      </div>
    );
  }

  // 🏠 Página normal después de introducir la contraseña
  return (
    <div className="min-h-screen w-full bg-zinc-50 dark:bg-black flex flex-col items-center p-10">

      {/* Imagen */}
      <Image
        src="/Luna.png"
        alt="Ícono"
        width={500}
        height={500}
        className="mb-4"
      />

      {/* Texto "INTI" */}
      <h1 className="text-4xl font-bold text-black dark:text-white mb-10">
        INTI
      </h1>

      {/* Opciones para navegar */}
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

    </div>
  );
}