import Product from "@/lib/models/Product"; // Importa el modelo de Producto
import { connectToDB } from "@/lib/mongoDB"; // Importa la función para conectar a la base de datos MongoDB
import { NextRequest, NextResponse } from "next/server"; // Importa NextRequest y NextResponse para manejar las solicitudes y respuestas

// Maneja la obtención de productos basados en una búsqueda
export const GET = async (req: NextRequest, { params }: { params: { query: string }}) => {
  try {
    await connectToDB(); // Conecta a la base de datos

    // Realiza la búsqueda de productos que coincidan con la consulta
    const searchedProducts = await Product.find({
      $or: [ // Utiliza $or para buscar en múltiples campos
        { title: { $regex: params.query, $options: "i" } }, // Busca en el título (ignorando mayúsculas y minúsculas)
        { category: { $regex: params.query, $options: "i" } }, // Busca en la categoría (ignorando mayúsculas y minúsculas)
        { tags: { $in: [new RegExp(params.query, "i")] } } // Busca en las etiquetas, usando $in para coincidir con una expresión regular
      ]
    });

    return NextResponse.json(searchedProducts, { status: 200 }); // Retorna los productos encontrados con un estado 200
  } catch (err) {
    console.log("[search_GET]", err); // Registra cualquier error en la consola
    return new NextResponse("Internal Server Error", { status: 500 }); // Retorna un error 500 en caso de fallo interno
  }
}

export const dynamic = "force-dynamic"; // Configura el comportamiento de renderizado dinámico
