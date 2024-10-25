import mongoose from "mongoose"; // Importa mongoose para interactuar con MongoDB

// Define el esquema para el modelo de Producto
const ProductSchema = new mongoose.Schema({
  title: String, // Título del producto
  description: String, // Descripción del producto
  media: [String], // Array de URL de medios (imágenes, videos, etc.)
  category: String, // Categoría del producto
  collections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Collection" }], // Referencia a colecciones, usando ObjectId para vincular a otros documentos
  tags: [String], // Array de etiquetas relacionadas con el producto
  sizes: [String], // Array de tamaños disponibles
  colors: [String], // Array de colores disponibles
  price: { 
    type: mongoose.Schema.Types.Decimal128, // Tipo de dato Decimal128 para precios
    get: (v: mongoose.Schema.Types.Decimal128) => { return parseFloat(v.toString()) } // Getter para convertir Decimal128 a float
  },
  expense: { 
    type: mongoose.Schema.Types.Decimal128, // Tipo de dato Decimal128 para gastos
    get: (v: mongoose.Schema.Types.Decimal128) => { return parseFloat(v.toString()) } // Getter para convertir Decimal128 a float
  },
  createdAt: { type: Date, default: Date.now }, // Fecha de creación, con valor por defecto como la fecha actual
  updatedAt: { type: Date, default: Date.now }, // Fecha de actualización, con valor por defecto como la fecha actual
}, { toJSON: { getters: true } }); // Configuración para que los getters se apliquen al convertir a JSON

// Crea el modelo de Producto, o lo obtiene si ya existe
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

// Exporta el modelo de Producto para su uso en otras partes de la aplicación
export default Product;
