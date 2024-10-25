import Customer from "@/lib/models/Customer"; // Importa el modelo de Cliente
import Order from "@/lib/models/Order"; // Importa el modelo de Orden
import { connectToDB } from "@/lib/mongoDB"; // Importa la función para conectar a la base de datos MongoDB
import { NextRequest, NextResponse } from "next/server"; // Importa NextRequest y NextResponse para manejar solicitudes y respuestas
import { stripe } from "@/lib/stripe"; // Importa la configuración de Stripe

// Maneja la creación de órdenes a través de un webhook de Stripe
export const POST = async (req: NextRequest) => {
  try {
    const rawBody = await req.text(); // Obtiene el cuerpo de la solicitud en formato texto
    const signature = req.headers.get("Stripe-Signature") as string; // Obtiene la firma de Stripe desde los encabezados

    // Construye el evento del webhook usando el cuerpo crudo y la firma
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET! // Usa la clave secreta del webhook de Stripe
    );

    // Verifica si el evento es una sesión de pago completada
    if (event.type === "checkout.session.completed") {
      const session = event.data.object; // Obtiene la sesión de pago del evento

      // Crea un objeto con la información del cliente
      const customerInfo = {
        clerkId: session?.client_reference_id, // ID del cliente de Clerk
        name: session?.customer_details?.name, // Nombre del cliente
        email: session?.customer_details?.email, // Email del cliente
      };

      // Crea un objeto con la dirección de envío
      const shippingAddress = {
        street: session?.shipping_details?.address?.line1, // Calle
        city: session?.shipping_details?.address?.city, // Ciudad
        state: session?.shipping_details?.address?.state, // Estado
        postalCode: session?.shipping_details?.address?.postal_code, // Código postal
        country: session?.shipping_details?.address?.country, // País
      };

      // Recupera la sesión de Stripe para obtener los detalles de los productos
      const retrieveSession = await stripe.checkout.sessions.retrieve(
        session.id,
        { expand: ["line_items.data.price.product"] } // Expande los productos en la sesión
      );

      const lineItems = await retrieveSession?.line_items?.data; // Obtiene los artículos de la línea de la sesión

      // Mapea los artículos de la línea a un formato adecuado para la orden
      const orderItems = lineItems?.map((item: any) => {
        return {
          product: item.price.product.metadata.productId, // ID del producto
          color: item.price.product.metadata.color || "N/A", // Color del producto
          size: item.price.product.metadata.size || "N/A", // Tamaño del producto
          quantity: item.quantity, // Cantidad del producto
        };
      });

      await connectToDB(); // Conecta a la base de datos

      // Crea una nueva orden con la información del cliente y los productos
      const newOrder = new Order({
        customerClerkId: customerInfo.clerkId, // ID del cliente de Clerk
        products: orderItems, // Productos de la orden
        shippingAddress, // Dirección de envío
        shippingRate: session?.shipping_cost?.shipping_rate, // Tarifa de envío
        totalAmount: session.amount_total ? session.amount_total / 100 : 0, // Monto total de la orden
      });

      await newOrder.save(); // Guarda la nueva orden en la base de datos

      // Busca al cliente en la base de datos
      let customer = await Customer.findOne({ clerkId: customerInfo.clerkId });

      if (customer) {
        // Si el cliente existe, añade la nueva orden a su lista de órdenes
        customer.orders.push(newOrder._id);
      } else {
        // Si el cliente no existe, crea un nuevo cliente con la información
        customer = new Customer({
          ...customerInfo, // Copia la información del cliente
          orders: [newOrder._id], // Añade la nueva orden
        });
      }

      await customer.save(); // Guarda la información del cliente
    }

    return new NextResponse("Order created", { status: 200 }); // Retorna una respuesta de éxito
  } catch (err) {
    console.log("[webhooks_POST]", err); // Registra cualquier error en la consola
    return new NextResponse("Failed to create the order", { status: 500 }); // Retorna un error 500 en caso de fallo
  }
}
