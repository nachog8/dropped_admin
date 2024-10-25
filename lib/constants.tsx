import {
  LayoutDashboard, // Icono para el Dashboard
  Shapes, // Icono para Colecciones
  ShoppingBag, // Icono para Órdenes
  Tag, // Icono para Productos
  UsersRound, // Icono para Clientes
} from "lucide-react"; // Importa iconos de la librería lucide-react

// Define los enlaces de navegación
export const navLinks = [
  {
    url: "/", // URL del enlace para el Dashboard
    icon: <LayoutDashboard />, // Icono correspondiente al Dashboard
    label: "Dashboard", // Texto que se mostrará en el enlace
  },
  {
    url: "/collections", // URL del enlace para Colecciones
    icon: <Shapes />, // Icono correspondiente a Colecciones
    label: "Colecciones", // Texto que se mostrará en el enlace
  },
  {
    url: "/products", // URL del enlace para Productos
    icon: <Tag />, // Icono correspondiente a Productos
    label: "Productos", // Texto que se mostrará en el enlace
  },
  {
    url: "/orders", // URL del enlace para Órdenes
    icon: <ShoppingBag />, // Icono correspondiente a Órdenes
    label: "Ordenes", // Texto que se mostrará en el enlace
  },
  {
    url: "/customers", // URL del enlace para Clientes
    icon: <UsersRound />, // Icono correspondiente a Clientes
    label: "Clientes", // Texto que se mostrará en el enlace
  },
];
