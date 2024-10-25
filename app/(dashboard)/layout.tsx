import type { Metadata } from "next"; // Importa el tipo Metadata de Next.js para definir metadatos
import { Inter } from "next/font/google"; // Importa la fuente Inter de Google
import "../globals.css"; // Importa el archivo de estilos globales
import { ClerkProvider } from "@clerk/nextjs"; // Importa el proveedor Clerk para la gestión de autenticación

import LeftSideBar from "@/components/layout/LeftSideBar"; // Importa el componente de la barra lateral izquierda
import TopBar from "@/components/layout/TopBar"; // Importa el componente de la barra superior
import { ToasterProvider } from "@/lib/ToasterProvider"; // Importa el proveedor de notificaciones (toasts)

// Configuración de la fuente Inter
const inter = Inter({ subsets: ["latin"] });

// Metadatos para la página
export const metadata: Metadata = {
  title: "Dropped - Admin Dashboard",
  description: "Admin dashboard to manage Dropped's data",
};

// Componente principal de diseño
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider> 
      <html lang="en">
        <body className={inter.className}>
          <ToasterProvider />
          <div className="flex max-lg:flex-col text-grey-1">
            <LeftSideBar />
            <TopBar />
            <div className="flex-1">{children}</div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
