import { DataTable } from "@/components/custom ui/DataTable"; // Importa el componente de tabla de datos
import { columns } from "@/components/orderItems/OrderItemsColums"; // Importa las columnas definidas para la tabla de elementos de la orden

// Componente asíncrono que muestra los detalles de una orden
const OrderDetails = async ({ params }: { params: { orderId: string }}) => {
  // Realiza una petición para obtener los detalles de la orden usando el ID de la orden
  const res = await fetch(`${process.env.ADMIN_DASHBOARD_URL}/api/orders/${params.orderId}`);
  // Extrae los detalles de la orden y la información del cliente de la respuesta
  const { orderDetails, customer } = await res.json();

  // Desestructura la dirección de envío desde los detalles de la orden
  const { street, city, state, postalCode, country } = orderDetails.shippingAddress;

  // Renderiza el contenido del componente
  return (
    <div className="flex flex-col p-10 gap-5">
      {/* Muestra el ID de la orden */}
      <p className="text-base-bold">
        Orden - ID: <span className="text-base-medium">{orderDetails._id}</span>
      </p>
      {/* Muestra el nombre del cliente */}
      <p className="text-base-bold">
        Nombre del cliente: <span className="text-base-medium">{customer.name}</span>
      </p>
      {/* Muestra la dirección de envío */}
      <p className="text-base-bold">
        Dirección de envío: <span className="text-base-medium">{street}, {city}, {state}, {postalCode}, {country}</span>
      </p>
      {/* Muestra el total pagado por la orden */}
      <p className="text-base-bold">
        Total pagado: <span className="text-base-medium">${orderDetails.totalAmount}</span>
      </p>
      {/* Muestra la tarifa de envío */}
      <p className="text-base-bold">
        Tarifa de envío - ID: <span className="text-base-medium">{orderDetails.shippingRate}</span>
      </p>
      {/* Muestra la tabla de productos de la orden */}
      <DataTable columns={columns} data={orderDetails.products} searchKey="product" />
    </div>
  );
}

export default OrderDetails; // Exporta el componente OrderDetails
