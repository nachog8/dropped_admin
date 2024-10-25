// Importación del modelo de cliente
import Customer from "@/lib/models/Customer";
// Importación del modelo de pedido
import Order from "@/lib/models/Order";
// Importación del modelo de producto
import Product from "@/lib/models/Product";
// Importación de la función para conectar a la base de datos MongoDB
import { connectToDB } from "@/lib/mongoDB";
// Importación de tipos para solicitudes y respuestas de Next.js
import { NextRequest, NextResponse } from "next/server";

// Manejo de la solicitud GET para obtener los detalles de un pedido específico
export const GET = async (req: NextRequest, { params }: { params: { orderId: String }}) => {
  try {
    // Conectar a la base de datos
    await connectToDB();

    // Buscar el pedido por ID y poblar la información de los productos relacionados
    const orderDetails = await Order.findById(params.orderId).populate({
      path: "products.product", // Ruta para poblar la información del producto
      model: Product
    });

    // Verificar si se encontraron detalles del pedido
    if (!orderDetails) {
      return new NextResponse(JSON.stringify({ message: "Order Not Found" }), { status: 404 }); // Retornar 404 si no se encuentra el pedido
    }

    // Buscar el cliente relacionado utilizando el ID de Clerk almacenado en el pedido
    const customer = await Customer.findOne({ clerkId: orderDetails.customerClerkId });

    // Retornar los detalles del pedido y la información del cliente en formato JSON con un código de estado 200
    return NextResponse.json({ orderDetails, customer }, { status: 200 });
  } catch (err) {
    // Manejo de errores y log de la excepción
    console.log("[orderId_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 }); // Código de estado 500 para errores internos
  }
}

// Configuración para que la función se ejecute de manera dinámica
export const dynamic = "force-dynamic";
