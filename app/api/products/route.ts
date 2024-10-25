import { auth } from "@clerk/nextjs"; // Importa el módulo de autenticación de Clerk
import { NextRequest, NextResponse } from "next/server"; // Importa NextRequest y NextResponse para manejar las solicitudes y respuestas

import { connectToDB } from "@/lib/mongoDB"; // Importa la función para conectar a la base de datos MongoDB
import Product from "@/lib/models/Product"; // Importa el modelo de Producto
import Collection from "@/lib/models/Collection"; // Importa el modelo de Colección

// Maneja la creación de un nuevo producto
export const POST = async (req: NextRequest) => {
  try {
    const { userId } = auth(); // Obtiene el ID del usuario autenticado

    // Verifica si el usuario está autenticado
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 }); // Retorna un error 401 si no está autenticado
    }

    await connectToDB(); // Conecta a la base de datos

    // Obtiene los datos del producto del cuerpo de la solicitud
    const {
      title,
      description,
      media,
      category,
      collections,
      tags,
      sizes,
      colors,
      price,
      expense,
    } = await req.json();

    // Verifica si se han proporcionado los campos obligatorios
    if (!title || !description || !media || !category || !price || !expense) {
      return new NextResponse("Not enough data to create a product", {
        status: 400, // Retorna un error 400 si faltan datos
      });
    }

    // Crea un nuevo producto en la base de datos
    const newProduct = await Product.create({
      title,
      description,
      media,
      category,
      collections,
      tags,
      sizes,
      colors,
      price,
      expense,
    });

    await newProduct.save(); // Guarda el nuevo producto

    // Actualiza las colecciones asociadas con el nuevo producto
    if (collections) {
      for (const collectionId of collections) {
        const collection = await Collection.findById(collectionId); // Busca cada colección por ID
        if (collection) {
          collection.products.push(newProduct._id); // Agrega el ID del nuevo producto a la colección
          await collection.save(); // Guarda la colección actualizada
        }
      }
    }

    return NextResponse.json(newProduct, { status: 200 }); // Retorna el nuevo producto creado con un estado 200
  } catch (err) {
    console.log("[products_POST]", err); // Registra cualquier error en la consola
    return new NextResponse("Internal Error", { status: 500 }); // Retorna un error 500 en caso de fallo interno
  }
};

// Maneja la obtención de productos
export const GET = async (req: NextRequest) => {
  try {
    await connectToDB(); // Conecta a la base de datos

    // Obtiene todos los productos, ordenados por fecha de creación y poblando las colecciones asociadas
    const products = await Product.find()
      .sort({ createdAt: "desc" })
      .populate({ path: "collections", model: Collection });

    return NextResponse.json(products, { status: 200 }); // Retorna la lista de productos con un estado 200
  } catch (err) {
    console.log("[products_GET]", err); // Registra cualquier error en la consola
    return new NextResponse("Internal Error", { status: 500 }); // Retorna un error 500 en caso de fallo interno
  }
};

export const dynamic = "force-dynamic"; // Configura el comportamiento de renderizado dinámico
