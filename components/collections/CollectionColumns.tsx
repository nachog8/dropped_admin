"use client"; // Indica que este archivo se ejecuta en el cliente

import { ColumnDef } from "@tanstack/react-table"; // Importa la definición de columnas para React Table
import Delete from "../custom ui/Delete"; // Importa el componente de eliminación
import Link from "next/link"; // Importa el componente Link de Next.js para navegación

// Define las columnas de la tabla
export const columns: ColumnDef<CollectionType>[] = [
  {
    accessorKey: "title", // Clave para acceder al dato
    header: "Titulo", // Encabezado de la columna
    cell: ({ row }) => ( // Renderiza la celda
      <Link
        href={`/collections/${row.original._id}`} // Enlace a la ruta de la colección
        className="hover:text-[rgba(6,173,239,1)]" // Estilo hover
      >
        {row.original.title} {/* Muestra el título de la colección */}
      </Link>
    ),
  },
  {
    accessorKey: "products", // Clave para acceder a los productos
    header: "Productos", // Encabezado de la columna
    cell: ({ row }) => <p>{row.original.products.length}</p>, // Muestra la cantidad de productos en la colección
  },
  {
    id: "actions", // ID de la columna de acciones
    cell: ({ row }) => <Delete item="collection" id={row.original._id} />, // Renderiza el componente de eliminación para la colección
  },
];
