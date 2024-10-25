import Product from "@/lib/models/Product"; // Importa el modelo de Producto
import { connectToDB } from "@/lib/mongoDB"; // Importa la función para conectar a la base de datos
import { NextRequest, NextResponse } from "next/server"; // Importa las clases para manejar solicitudes y respuestas

// Define una función para manejar las solicitudes GET
export const GET = async (req: NextRequest, { params }: { params: { productId: string } }) => {
  try {
    // Conecta a la base de datos
    await connectToDB();

    // Busca el producto por su ID
    const product = await Product.findById(params.productId);

    // Verifica si el producto existe
    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }), // Mensaje si no se encuentra el producto
        { status: 404 } // Código de estado 404
      );
    }

    // Busca productos relacionados que compartan la misma categoría o colecciones
    const relatedProducts = await Product.find({
      $or: [
        { category: product.category }, // Coincide con la misma categoría
        { collections: { $in: product.collections } } // Coincide con colecciones en las que está el producto
      ],
      _id: { $ne: product._id } // Excluye el producto actual de los resultados
    });

    // Verifica si se encontraron productos relacionados
    if (!relatedProducts || relatedProducts.length === 0) {
      return new NextResponse(
        JSON.stringify({ message: "No related products found" }), // Mensaje si no se encuentran productos relacionados
        { status: 404 } // Código de estado 404
      );
    }

    // Devuelve los productos relacionados en formato JSON
    return NextResponse.json(relatedProducts, { status: 200 });
  } catch (err) {
    // Maneja cualquier error que ocurra durante el proceso
    console.log("[related_GET]", err); // Registra el error en la consola
    return new NextResponse("Internal Server Error", { status: 500 }); // Devuelve un error 500
  }
};

// Establece el comportamiento de renderizado dinámico
export const dynamic = "force-dynamic";
