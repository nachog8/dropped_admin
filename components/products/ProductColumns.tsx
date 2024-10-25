"use client"; // Indica que este módulo debe ser ejecutado en el cliente.

import { ColumnDef } from "@tanstack/react-table"; // Importa la definición de columnas de react-table.
import Delete from "../custom ui/Delete"; // Importa el componente Delete para eliminar elementos.
import Link from "next/link"; // Importa el componente Link de Next.js para la navegación.

export const columns: ColumnDef<ProductType>[] = [
  {
    accessorKey: "title", // Clave para acceder al título del producto.
    header: "Titulo", // Encabezado de la columna.
    cell: ({ row }) => ( // Renderiza la celda para el título.
      <Link
        href={`/products/${row.original._id}`} // Enlace a la página del producto utilizando su ID.
        className="hover:text-[rgba(6,173,239,1)]" // Estilo para el enlace en hover.
      >
        {row.original.title} {/* Muestra el título de la producto */}
      </Link>
    ),
  },
  {
    accessorKey: "category", // Clave para acceder a la categoría del producto.
    header: "Categoria", // Encabezado de la columna.
  },
  {
    accessorKey: "collections", // Clave para acceder a las colecciones del producto.
    header: "Colecciones", // Encabezado de la columna.
    cell: ({ row }) => row.original.collections.map((collection) => collection.title).join(", "), // Muestra los títulos de las colecciones, separados por comas.
  },
  {
    accessorKey: "price", // Clave para acceder al precio del producto.
    header: "Precio ($)", // Encabezado de la columna.
  },
  {
    accessorKey: "expense", // Clave para acceder al costo del producto.
    header: "Costo ($)", // Encabezado de la columna.
  },
  {
    id: "actions", // ID para la columna de acciones.
    cell: ({ row }) => <Delete item="product" id={row.original._id} />, // Renderiza el componente Delete para eliminar el producto.
  },
];
