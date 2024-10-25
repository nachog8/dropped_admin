import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import { format } from "date-fns"; // Importación para formatear fechas

// Manejo de la solicitud GET para obtener todos los pedidos
export const GET = async (req: NextRequest) => {
  try {
    // Conectar a la base de datos
    await connectToDB();

    // Obtener todos los pedidos y ordenarlos por fecha de creación de forma descendente
    const orders = await Order.find().sort({ createdAt: "desc" });

    // Mapeo de cada pedido para obtener detalles adicionales
    const orderDetails = await Promise.all(orders.map(async (order) => {
      // Buscar el cliente asociado al pedido utilizando su clerkId
      const customer = await Customer.findOne({ clerkId: order.customerClerkId });
      // Retornar un objeto con los detalles del pedido y del cliente
      return {
        _id: order._id, // ID del pedido
        customer: customer.name, // Nombre del cliente
        products: order.products.length, // Número de productos en el pedido
        totalAmount: order.totalAmount, // Monto total del pedido
        createdAt: format(order.createdAt, "dd MMM, yyyy") // Formato de fecha: día mes año
      };
    }));

    // Retornar los detalles de los pedidos en formato JSON con un código de estado 200
    return NextResponse.json(orderDetails, { status: 200 });
  } catch (err) {
    // Manejo de errores y registro de la excepción
    console.log("[orders_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export const dynamic = "force-dynamic";
