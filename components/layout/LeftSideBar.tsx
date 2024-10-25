"use client"; // Indica que este componente debe ser tratado como un componente de cliente en Next.js

import { UserButton } from "@clerk/nextjs"; // Importa el botón de usuario de Clerk
import Image from "next/image"; // Importa el componente Image de Next.js para imágenes optimizadas
import Link from "next/link"; // Importa el componente Link de Next.js para enlaces
import { usePathname } from "next/navigation"; // Importa el hook usePathname para obtener la ruta actual

import { navLinks } from "@/lib/constants"; // Importa los enlaces de navegación desde un archivo de constantes

const LeftSideBar = () => {
  const pathname = usePathname(); // Obtiene la ruta actual

  return (
    <div className="h-screen left-0 top-0 sticky p-10 flex flex-col gap-16 bg-blue-2 shadow-xl max-lg:hidden">
      {/* Logo de la aplicación */}
      <Image src="/logo.png" alt="logo" width={150} height={70} />

      {/* Enlaces de navegación */}
      <div className="flex flex-col gap-12">
        {navLinks.map((link) => (
          <Link
            href={link.url} // Ruta del enlace
            key={link.label} // Clave única para el enlace
            className={`flex gap-4 text-body-medium ${
              pathname === link.url ? "text-blue-1" : "text-grey-1"
            }`} // Clase para el enlace, cambia de color si es la ruta activa
          >
            {link.icon} <p>{link.label}</p> {/* Muestra el ícono y el texto del enlace */}
          </Link>
        ))}
      </div>

      {/* Sección del botón de usuario y edición de perfil */}
      <div className="flex gap-4 text-body-medium items-center">
        <UserButton /> {/* Botón para acceder a la información del usuario */}
        <p>Editar Perfil</p> {/* Texto para la opción de edición de perfil */}
      </div>
    </div>
  );
};

export default LeftSideBar; // Exporta el componente LeftSideBar
