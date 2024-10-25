import Customer from "../models/Customer"; // Importa el modelo de Cliente
import Order from "../models/Order"; // Importa el modelo de Orden
import { connectToDB } from "../mongoDB"; // Importa la función para conectar a la base de datos MongoDB

// Función para obtener el total de ventas
export const getTotalSales = async () => {
  await connectToDB(); // Conecta a la base de datos
  const orders = await Order.find(); // Obtiene todas las órdenes
  const totalOrders = orders.length; // Calcula el total de órdenes
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0); // Calcula los ingresos totales sumando el total de cada orden
  return { totalOrders, totalRevenue }; // Retorna el total de órdenes y los ingresos totales
}

// Función para obtener el total de clientes
export const getTotalCustomers = async () => {
  await connectToDB(); // Conecta a la base de datos
  const customers = await Customer.find(); // Obtiene todos los clientes
  const totalCustomers = customers.length; // Calcula el total de clientes
  return totalCustomers; // Retorna el total de clientes
}

// Función para obtener las ventas por mes
export const getSalesPerMonth = async () => {
  await connectToDB(); // Conecta a la base de datos
  const orders = await Order.find(); // Obtiene todas las órdenes

  // Cálculo de las ventas por mes
  const salesPerMonth = orders.reduce((acc, order) => {
    const monthIndex = new Date(order.createdAt).getMonth(); // Obtiene el índice del mes de la fecha de creación de la orden (0 para enero, 11 para diciembre)
    acc[monthIndex] = (acc[monthIndex] || 0) + order.totalAmount; // Suma el total de la orden al mes correspondiente
    return acc; // Retorna el acumulador
  }, {});

  // Prepara los datos para el gráfico, con ventas por mes
  const graphData = Array.from({ length: 12 }, (_, i) => {
    const month = new Intl.DateTimeFormat('es-AR', { month: 'short' }).format(new Date(0, i)); // Formatea el mes en formato corto (ej. "Jun" para junio)
    return { name: month, sales: salesPerMonth[i] || 0 }; // Crea un objeto con el nombre del mes y las ventas correspondientes
  });

  return graphData; // Retorna los datos formateados para el gráfico
}
