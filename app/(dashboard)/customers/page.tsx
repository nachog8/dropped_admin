import { DataTable } from '@/components/custom ui/DataTable'; // Importa el componente de tabla de datos
import { columns } from '@/components/customers/CustomerColumns'; // Importa las columnas definidas para la tabla de clientes
import { Separator } from '@/components/ui/separator'; // Importa el componente separador
import Customer from '@/lib/models/Customer'; // Importa el modelo de cliente
import { connectToDB } from '@/lib/mongoDB'; // Importa la función para conectar a la base de datos MongoDB

// Componente asíncrono para mostrar la lista de clientes
const Customers = async () => {
  // Establece conexión con la base de datos
  await connectToDB();

  // Obtiene todos los clientes y los ordena por la fecha de creación en orden descendente
  const customers = await Customer.find().sort({ createdAt: "desc" });

  // Renderiza el contenido del componente
  return (
    <div className='px-10 py-5'>
      <p className='text-heading2-bold'>Clientes</p> {/* Título de la sección */}
      <Separator className='bg-grey-1 my-5' /> {/* Separador visual */}
      {/* Tabla de datos que muestra la información de los clientes */}
      <DataTable columns={columns} data={customers} searchKey='name' />
    </div>
  );
}

// Exporta el componente con la propiedad para forzar la actualización dinámica
export const dynamic = "force-dynamic";

export default Customers; // Exporta el componente Customers
