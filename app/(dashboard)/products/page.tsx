"use client"; // Indica que este componente se ejecuta en el lado del cliente

import { useRouter } from "next/navigation"; // Importa el hook para manejar la navegación
import { useEffect, useState } from "react"; // Importa hooks de React para el estado y efectos
import { Plus } from "lucide-react"; // Importa el icono de Plus

import Loader from "@/components/custom ui/Loader"; // Importa el componente de carga
import { Button } from "@/components/ui/button"; // Importa el componente de botón
import { Separator } from "@/components/ui/separator"; // Importa el componente separador
import { DataTable } from "@/components/custom ui/DataTable"; // Importa el componente de tabla de datos
import { columns } from "@/components/products/ProductColumns"; // Importa las columnas de la tabla de productos

const Products = () => {
  const router = useRouter(); // Inicializa el router para manejar la navegación

  const [loading, setLoading] = useState(true); // Estado para manejar la carga de datos
  const [products, setProducts] = useState<ProductType[]>([]); // Estado para almacenar la lista de productos

  // Función asíncrona para obtener los productos desde la API
  const getProducts = async () => {
    try {
      const res = await fetch("/api/products", {
        method: "GET", // Método para la solicitud GET
      });
      const data = await res.json(); // Convierte la respuesta a JSON
      setProducts(data); // Almacena los productos en el estado
      setLoading(false); // Cambia el estado de carga a falso
    } catch (err) {
      console.log("[products_GET]", err); // Manejo de errores en la consola
    }
  };

  // useEffect para llamar a getProducts al montar el componente
  useEffect(() => {
    getProducts(); // Llama a la función para obtener los productos
  }, []); // El array vacío significa que se ejecuta una vez al montar

  // Renderiza un loader mientras se cargan los datos
  return loading ? (
    <Loader /> // Muestra el loader si está cargando
  ) : (
    <div className="px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-heading2-bold">Productos</p> {/* Título de la sección */}
        <Button
          className="bg-blue-1 text-white"
          onClick={() => router.push("/products/new")} // Navega a la página para crear un nuevo producto
        >
          <Plus className="h-4 w-4 mr-2" /> {/* Icono de añadir */}
          Crear producto
        </Button>
      </div>
      <Separator className="bg-grey-1 my-4" /> {/* Línea separadora */}
      <DataTable columns={columns} data={products} searchKey="title" /> {/* Tabla de datos con productos */}
    </div>
  );
};

export default Products; // Exporta el componente Products
