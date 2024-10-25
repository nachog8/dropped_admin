"use client"; // Indica que este componente se ejecuta en el lado del cliente

import { useEffect, useState, useCallback } from "react"; // Importa hooks necesarios

import Loader from "@/components/custom ui/Loader"; // Importa el componente de carga
import CollectionForm from "@/components/collections/CollectionForm"; // Importa el formulario de colección

// Componente para mostrar los detalles de una colección
const CollectionDetails = ({ params }: { params: { collectionId: string }}) => {
  // Estado para manejar la carga del componente
  const [loading, setLoading] = useState(true);
  
  // Estado para almacenar los detalles de la colección
  const [collectionDetails, setCollectionDetails] = useState<CollectionType | null>(null);

  // Función asíncrona para obtener los detalles de la colección
  const getCollectionDetails = useCallback(async () => {
    try { 
      // Realiza una solicitud GET para obtener los detalles de la colección
      const res = await fetch(`/api/collections/${params.collectionId}`, {
        method: "GET"
      });
      const data = await res.json(); // Convierte la respuesta a formato JSON
      setCollectionDetails(data); // Almacena los detalles de la colección en el estado
      setLoading(false); // Cambia el estado de carga a false
    } catch (err) {
      // Maneja cualquier error en la solicitud
      console.log("[collectionId_GET]", err);
    }
  }, [params.collectionId]); // Agrega params.collectionId como dependencia

  // Efecto que se ejecuta al montar el componente
  useEffect(() => {
    getCollectionDetails(); // Llama a la función para obtener los detalles de la colección
  }, [getCollectionDetails]); // Agrega getCollectionDetails como dependencia

  // Muestra el componente de carga mientras se obtienen los datos
  return loading ? <Loader /> : (
    // Muestra el formulario de colección con los datos iniciales obtenidos
    <CollectionForm initialData={collectionDetails} />
  );
};

export default CollectionDetails; // Exporta el componente CollectionDetails
