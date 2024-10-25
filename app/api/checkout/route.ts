import { NextRequest, NextResponse } from "next/server"; // Importa NextRequest y NextResponse de Next.js
import { stripe } from "@/lib/stripe"; // Importa la instancia de Stripe desde la librería de utilidades

// Define los encabezados CORS para permitir solicitudes de diferentes orígenes
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Permite el acceso desde cualquier origen
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS", // Métodos permitidos
  "Access-Control-Allow-Headers": "Content-Type, Authorization", // Encabezados permitidos
};

// Maneja la solicitud OPTIONS para permitir el preflight CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Maneja la solicitud POST para crear una sesión de pago en Stripe
export async function POST(req: NextRequest) {
  try {
    // Extrae los datos del cuerpo de la solicitud
    const { cartItems, customer } = await req.json();

    // Verifica si faltan datos necesarios
    if (!cartItems || !customer) {
      return new NextResponse("Not enough data to checkout", { status: 400 });
    }

    // Crea una sesión de pago en Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // Tipos de métodos de pago aceptados
      mode: "payment", // Modo de la sesión de pago
      shipping_address_collection: {
        allowed_countries: ["US", "AR"], // Países permitidos para la recolección de direcciones de envío
      },
      shipping_options: [
        { shipping_rate: "shr_1QDrES2KDzwDXQNVzABDDuRJ" }, // Opción de envío 1
        { shipping_rate: "shr_1QDrDf2KDzwDXQNVek1X10Fl" }, // Opción de envío 2
      ],
      line_items: cartItems.map((cartItem: any) => ({
        price_data: {
          currency: "usd", // Moneda utilizada
          product_data: {
            name: cartItem.item.title, // Título del producto
            metadata: {
              productId: cartItem.item._id, // ID del producto
              ...(cartItem.size && { size: cartItem.size }), // Tamaño opcional
              ...(cartItem.color && { color: cartItem.color }), // Color opcional
            },
          },
          unit_amount: cartItem.item.price * 100, // Precio del producto en centavos
        },
        quantity: cartItem.quantity, // Cantidad del producto
      })),
      client_reference_id: customer.clerkId, // ID de referencia del cliente
      success_url: `${process.env.ECOMMERCE_STORE_URL}/payment_success`, // URL de éxito
      cancel_url: `${process.env.ECOMMERCE_STORE_URL}/cart`, // URL de cancelación
    });

    // Devuelve la sesión de Stripe con encabezados CORS
    return NextResponse.json(session, { headers: corsHeaders });
  } catch (err) {
    // Manejo de errores
    console.log("[checkout_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
