"use client"; // Indica que este componente se ejecuta en el lado del cliente

import { DataTable } from "@/components/custom ui/DataTable"; // Importa el componente de tabla de datos
import Loader from "@/components/custom ui/Loader"; // Importa el componente de carga
import { columns } from "@/components/orders/OrderColumns"; // Importa las columnas definidas para la tabla de pedidos
import { Separator } from "@/components/ui/separator"; // Importa el componente separador

import { useEffect, useState } from "react"; // Importa hooks de React

const Orders = () => {
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [orders, setOrders] = useState([]); // Estado para almacenar la lista de pedidos

  // Función asíncrona para obtener los pedidos desde la API
  const getOrders = async () => {
    try {
      const res = await fetch(`/api/orders`); // Realiza una solicitud para obtener los pedidos
      const data = await res.json(); // Convierte la respuesta a JSON
      setOrders(data); // Almacena los pedidos en el estado
      setLoading(false); // Cambia el estado de carga a falso
    } catch (err) {
      console.log("[orders_GET]", err); // Manejo de errores en la consola
    }
  };

  // useEffect para llamar a getOrders al montar el componente
  useEffect(() => {
    getOrders();
  }, []); // El array vacío significa que se ejecuta una vez al montar

  // Renderiza un loader mientras se cargan los datos
  return loading ? <Loader /> : (
    <div className="px-10 py-5">
      <p className="text-heading2-bold">Pedidos</p> {/* Título de la sección */}
      <Separator className="bg-grey-1 my-5" /> {/* Separador visual */}
      {/* Tabla de datos con columnas y datos de pedidos */}
      <DataTable columns={columns} data={orders} searchKey="_id" />
    </div>
  );
};

export const dynamic = "force-dynamic"; // Indica que este componente debe ser dinámico

export default Orders; // Exporta el componente Orders
