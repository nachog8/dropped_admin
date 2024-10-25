"use client"; // Indica que este componente debe ser renderizado en el cliente.

import { Button } from "@/components/ui/button";
import {
  ColumnDef,
  ColumnFiltersState,
  getFilteredRowModel,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "../ui/input";
import { useState } from "react";

// Definición de las propiedades que acepta el componente DataTable.
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]; // Columnas de la tabla.
  data: TData[]; // Datos a mostrar en la tabla.
  searchKey: string; // Clave para la búsqueda.
}

// Componente DataTable que acepta columnas, datos y clave de búsqueda como propiedades.
export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
}: DataTableProps<TData, TValue>) {
  // Estado para almacenar los filtros de columnas.
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Inicialización de la tabla con la configuración y datos proporcionados.
  const table = useReactTable({
    data, // Datos de la tabla.
    columns, // Definición de columnas.
    getCoreRowModel: getCoreRowModel(), // Modelo base para las filas.
    onColumnFiltersChange: setColumnFilters, // Función que se llama al cambiar los filtros.
    getPaginationRowModel: getPaginationRowModel(), // Modelo para la paginación.
    getFilteredRowModel: getFilteredRowModel(), // Modelo para las filas filtradas.
    state: {
      columnFilters, // Estado actual de los filtros de columnas.
    },
  });

  return (
    <div className="py-5">
      {/* Barra de búsqueda para filtrar los datos de la tabla */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Buscar..." // Texto del placeholder.
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""} // Valor actual del filtro.
          onChange={(event) =>
            table.getColumn(searchKey)?.setFilterValue(event.target.value) // Actualiza el filtro cuando se cambia el valor.
          }
          className="max-w-sm" // Estilos del input.
        />
      </div>

      {/* Contenedor para la tabla */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {/* Renderiza los grupos de encabezados de la tabla */}
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {/* Renderiza el encabezado de la columna si no es un placeholder */}
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? ( // Comprueba si hay filas para mostrar
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"} // Indica si la fila está seleccionada
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {/* Renderiza el contenido de la celda */}
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length} // Colspan para ocupar todas las columnas
                  className="h-24 text-center" // Estilos para la celda
                >
                  No hay resultados. // Mensaje cuando no hay datos
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Controles de paginación */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()} // Navega a la página anterior
          disabled={!table.getCanPreviousPage()} // Desactiva el botón si no hay página anterior
        >
          Atras
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()} // Navega a la siguiente página
          disabled={!table.getCanNextPage()} // Desactiva el botón si no hay siguiente página
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
