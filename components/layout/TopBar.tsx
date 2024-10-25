"use client"; // Indica que este componente debe ser tratado como un componente de cliente en Next.js

import { UserButton } from "@clerk/nextjs"; // Importa el botón de usuario de Clerk
import Image from "next/image"; // Importa el componente Image de Next.js para imágenes optimizadas
import Link from "next/link"; // Importa el componente Link de Next.js para enlaces
import { useState } from "react"; // Importa el hook useState de React para manejar el estado
import { usePathname } from "next/navigation"; // Importa el hook usePathname para obtener la ruta actual
import { Menu } from "lucide-react"; // Importa el ícono de menú de Lucide

import { navLinks } from "@/lib/constants"; // Importa los enlaces de navegación desde un archivo de constantes

const TopBar = () => {
  const [dropdownMenu, setDropdownMenu] = useState(false); // Estado para controlar la visibilidad del menú desplegable
  const pathname = usePathname(); // Obtiene la ruta actual

  return (
    <div className="sticky top-0 z-20 w-full flex justify-between items-center px-8 py-4 bg-blue-2 shadow-xl lg:hidden">
      {/* Logo de la aplicación */}
      <Image src="/logo.png" alt="logo" width={150} height={70} />

      {/* Enlaces de navegación visibles en pantallas grandes */}
      <div className="flex gap-8 max-md:hidden">
        {navLinks.map((link) => (
          <Link
            href={link.url} // Ruta del enlace
            key={link.label} // Clave única para el enlace
            className={`flex gap-4 text-body-medium ${pathname === link.url ? "text-blue-1" : "text-grey-1"}`} // Clase para el enlace, cambia de color si es la ruta activa
          >
            <p>{link.label}</p> // Texto del enlace
          </Link>
        ))}
      </div>

      <div className="relative flex gap-4 items-center">
        {/* Icono de menú que controla el menú desplegable */}
        <Menu
          className="cursor-pointer md:hidden" // Clase para ocultar el ícono en pantallas grandes
          onClick={() => setDropdownMenu(!dropdownMenu)} // Cambia el estado del menú al hacer clic
        />
        {/* Renderiza el menú desplegable si su estado es verdadero */}
        {dropdownMenu && (
          <div className="absolute top-10 right-6 flex flex-col gap-8 p-5 bg-white shadow-xl rounded-lg">
            {navLinks.map((link) => (
              <Link
                href={link.url} // Ruta del enlace
                key={link.label} // Clave única para el enlace
                className="flex gap-4 text-body-medium"
              >
                {link.icon} <p>{link.label}</p> {/* Muestra el ícono y el texto del enlace */}
              </Link>
            ))}
          </div>
        )}
        {/* Botón de usuario para acceder a la información del usuario */}
        <UserButton />
      </div>
    </div>
  );
};

export default TopBar; // Exporta el componente TopBar
