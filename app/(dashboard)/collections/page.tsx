"use client";

import { useEffect, useState } from "react"; // Importa hooks para manejar el estado y efectos
import { useRouter } from "next/navigation"; // Importa el hook para la navegación
import { Plus } from "lucide-react"; // Importa el ícono de "plus"

import { columns } from "@/components/collections/CollectionColumns"; // Importa las columnas de la tabla
import { DataTable } from "@/components/custom ui/DataTable"; // Importa el componente de tabla de datos
import { Button } from "@/components/ui/button"; // Importa el botón personalizado
import { Separator } from "@/components/ui/separator"; // Importa el separador
import Loader from "@/components/custom ui/Loader"; // Importa el componente de carga

// Componente para mostrar las colecciones
const Collections = () => {
  const router = useRouter(); // Inicializa el router para la navegación

  // Estado para manejar la carga del componente
  const [loading, setLoading] = useState(true);
  
  // Estado para almacenar las colecciones
  const [collections, setCollections] = useState([]);

  // Función asíncrona para obtener las colecciones
  const getCollections = async () => {
    try {
      // Realiza una solicitud GET para obtener las colecciones
      const res = await fetch("/api/collections", {
        method: "GET",
      });
      const data = await res.json(); // Convierte la respuesta a formato JSON
      setCollections(data); // Almacena las colecciones en el estado
      setLoading(false); // Cambia el estado de carga a false
    } catch (err) {
      // Maneja cualquier error en la solicitud
      console.log("[collections_GET]", err);
    }
  };

  // Efecto que se ejecuta al montar el componente
  useEffect(() => {
    getCollections(); // Llama a la función para obtener las colecciones
  }, []);

  // Muestra el componente de carga mientras se obtienen los datos
  return loading ? <Loader /> : (
    <div className="px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-heading2-bold">Colecciones</p>
        <Button className="bg-blue-1 text-white" onClick={() => router.push("/collections/new")}>
          <Plus className="h-4 w-4 mr-2" /> {/* Ícono de "plus" */}
          Crear colección
        </Button>
      </div>
      <Separator className="bg-grey-1 my-4" /> {/* Separador */}
      <DataTable columns={columns} data={collections} searchKey="title" /> {/* Tabla de datos con colecciones */}
    </div>
  );
};

export default Collections; // Exporta el componente Collections
