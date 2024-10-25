"use client"; // Indica que este componente se ejecuta en el lado del cliente

import Loader from '@/components/custom ui/Loader'; // Importa el componente de carga
import ProductForm from '@/components/products/ProductForm'; // Importa el formulario de productos
import React, { useEffect, useState } from 'react'; // Importa React y hooks necesarios

const ProductDetails = ({ params }: { params: { productId: string }}) => {
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [productDetails, setProductDetails] = useState<ProductType | null>(null); // Estado para almacenar los detalles del producto

  // Función asíncrona para obtener los detalles del producto desde la API
  const getProductDetails = async () => {
    try { 
      const res = await fetch(`/api/products/${params.productId}`, { // Realiza una solicitud GET para obtener los detalles del producto
        method: "GET"
      });
      const data = await res.json(); // Convierte la respuesta a JSON
      setProductDetails(data); // Almacena los detalles del producto en el estado
      setLoading(false); // Cambia el estado de carga a falso
    } catch (err) {
      console.log("[productId_GET]", err); // Manejo de errores en la consola
    }
  };

  // useEffect para llamar a getProductDetails al montar el componente
  useEffect(() => {
    getProductDetails(); // Llama a la función para obtener los detalles del producto
  }, []); // El array vacío significa que se ejecuta una vez al montar

  // Renderiza un loader mientras se cargan los datos
  return loading ? <Loader /> : (
    <ProductForm initialData={productDetails} /> // Renderiza el formulario de producto con los datos iniciales
  );
};

export default ProductDetails; // Exporta el componente ProductDetails
