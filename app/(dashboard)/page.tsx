import SalesChart from "@/components/custom ui/SalesChart"; // Importa el componente de gráfico de ventas
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Importa los componentes de tarjeta
import { Separator } from "@/components/ui/separator"; // Importa el componente separador
import {
  getSalesPerMonth, // Función para obtener las ventas por mes
  getTotalCustomers, // Función para obtener el total de clientes
  getTotalSales, // Función para obtener el total de ventas
} from "@/lib/actions/actions"; // Importa las acciones de la librería
import { CircleDollarSign, ShoppingBag, UserRound } from "lucide-react"; // Importa iconos de Lucide

// Componente principal del dashboard
export default async function Home() {
  // Obtiene el ingreso total y el total de pedidos
  const totalRevenue = await getTotalSales().then((data) => data.totalRevenue);
  const totalOrders = await getTotalSales().then((data) => data.totalOrders);
  const totalCustomers = await getTotalCustomers(); // Obtiene el total de clientes

  const graphData = await getSalesPerMonth(); // Obtiene los datos del gráfico de ventas por mes

  return (
    <div className="px-8 py-10"> {/* Contenedor principal con márgenes */}
      <p className="text-heading2-bold">Dashboard</p> {/* Título del dashboard */}
      <Separator className="bg-grey-1 my-5" /> {/* Línea separadora */}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-10"> {/* Grid para las tarjetas */}
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Ingresos totales</CardTitle> {/* Título de la tarjeta de ingresos */}
            <CircleDollarSign className="max-sm:hidden" /> {/* Icono de ingresos */}
          </CardHeader>
          <CardContent>
            <p className="text-body-bold">$ {totalRevenue}</p> {/* Muestra el total de ingresos */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Pedidos totales</CardTitle> {/* Título de la tarjeta de pedidos */}
            <ShoppingBag className="max-sm:hidden" /> {/* Icono de pedidos */}
          </CardHeader>
          <CardContent>
            <p className="text-body-bold">{totalOrders}</p> {/* Muestra el total de pedidos */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Clientes totales</CardTitle> {/* Título de la tarjeta de clientes */}
            <UserRound className="max-sm:hidden" /> {/* Icono de clientes */}
          </CardHeader>
          <CardContent>
            <p className="text-body-bold">{totalCustomers}</p> {/* Muestra el total de clientes */}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-10"> {/* Tarjeta para el gráfico de ventas */}
        <CardHeader>
          <CardTitle>Grafico de ventas ($)</CardTitle> {/* Título del gráfico */}
        </CardHeader>
        <CardContent>
          <SalesChart data={graphData} /> {/* Componente gráfico con los datos de ventas */}
        </CardContent>
      </Card>
    </div>
  );
}
