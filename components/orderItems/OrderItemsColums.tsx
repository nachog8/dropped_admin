"use client"; // Indica que este componente debe ser tratado como un componente de cliente en Next.js

import { ColumnDef } from "@tanstack/react-table"; // Importa la definición de columnas de la tabla
import Link from "next/link"; // Importa el componente Link de Next.js para enlaces

// Definición de las columnas para la tabla de elementos de pedidos
export const columns: ColumnDef<OrderItemType>[] = [
  {
    accessorKey: "product", // Clave para acceder al producto
    header: "Producto", // Encabezado de la columna
    cell: ({ row }) => { // Renderiza la celda para cada fila
      return (
        <Link
          href={`/products/${row.original.product._id}`} // Enlace al detalle del producto
          className="hover:text-[rgba(6,173,239,1)]" // Clase para el efecto hover
        >
          {row.original.product.title} // Muestra el título del producto
        </Link>
      );
    },
  },
  {
    accessorKey: "color", // Clave para acceder al color del producto
    header: "Color", // Encabezado de la columna
  },
  {
    accessorKey: "size", // Clave para acceder al tamaño del producto
    header: "Tamaño", // Encabezado de la columna
  },
  {
    accessorKey: "quantity", // Clave para acceder a la cantidad del producto
    header: "Cantidad", // Encabezado de la columna
  },
];
