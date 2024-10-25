// Definición del tipo CollectionType
type CollectionType = {
  _id: string; // Identificador único de la colección
  title: string; // Título de la colección
  description: string; // Descripción de la colección
  image: string; // URL de la imagen de la colección
  products: ProductType[]; // Array de productos que pertenecen a esta colección
}

// Definición del tipo ProductType
type ProductType = {
  _id: string; // Identificador único del producto
  title: string; // Título del producto
  description: string; // Descripción del producto
  media: [string]; // Array de URLs de medios (imágenes, videos, etc.) relacionados con el producto
  category: string; // Categoría a la que pertenece el producto
  collections: [CollectionType]; // Array de colecciones a las que pertenece el producto
  tags: [string]; // Array de etiquetas relacionadas con el producto
  sizes: [string]; // Array de tamaños disponibles para el producto
  colors: [string]; // Array de colores disponibles para el producto
  price: number; // Precio del producto
  expense: number; // Costo del producto
  createdAt: Date; // Fecha de creación del producto
  updatedAt: Date; // Fecha de última actualización del producto
}

// Definición del tipo OrderColumnType
type OrderColumnType = {
  _id: string; // Identificador único de la orden
  customer: string; // Identificador del cliente asociado a la orden
  products: number; // Cantidad de productos en la orden
  totalAmount: number; // Monto total de la orden
  createdAt: string; // Fecha de creación de la orden (como cadena)
}

// Definición del tipo OrderItemType
type OrderItemType = {
  product: ProductType; // Producto asociado a este ítem de la orden
  color: string; // Color del producto en este ítem
  size: string; // Tamaño del producto en este ítem
  quantity: number; // Cantidad del producto en este ítem
}

// Definición del tipo CustomerType
type CustomerType = {
  clerkId: string; // Identificador del cliente en Clerk (sistema de gestión de usuarios)
  name: string; // Nombre del cliente
  email: string; // Correo electrónico del cliente
}
