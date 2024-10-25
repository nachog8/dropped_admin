// Importación del modelo de pedido
import Order from "@/lib/models/Order";
// Importación del modelo de producto
import Product from "@/lib/models/Product";
// Importación de la función para conectar a la base de datos MongoDB
import { connectToDB } from "@/lib/mongoDB";
// Importación de tipos para solicitudes y respuestas de Next.js
import { NextRequest, NextResponse } from "next/server";

// Manejo de la solicitud GET para obtener pedidos de un cliente específico
export const GET = async (
  req: NextRequest,
  { params }: { params: { customerId: string } } // Parámetros que incluyen el ID del cliente
) => {
  try {
    // Conectar a la base de datos
    await connectToDB();

    // Buscar los pedidos que pertenecen al cliente especificado por el customerId
    const orders = await Order.find({
      customerClerkId: params.customerId, // Filtrar pedidos por el ID de Clerk del cliente
    }).populate({ path: "products.product", model: Product }); // Poblar información del producto relacionado

    // Retornar los pedidos encontrados en formato JSON con un código de estado 200
    return NextResponse.json(orders, { status: 200 });
  } catch (err) {
    // Manejo de errores y registro de la excepción
    console.log("[customerId_GET", err);
    return new NextResponse("Internal Server Error", { status: 500 }); // Código de estado 500 para errores internos
  }
};

// Configuración para que la función se ejecute de manera dinámica
export const dynamic = "force-dynamic";
