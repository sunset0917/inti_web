import Image from "next/image";
import Link from "next/link";

export default function Home() {
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

    </div>
  );
}
