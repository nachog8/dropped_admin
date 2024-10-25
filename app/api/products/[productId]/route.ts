import Collection from "@/lib/models/Collection"; // Importa el modelo de Colección
import Product from "@/lib/models/Product"; // Importa el modelo de Producto
import { connectToDB } from "@/lib/mongoDB"; // Importa la función para conectar a la base de datos
import { auth } from "@clerk/nextjs"; // Importa el módulo de autenticación de Clerk

import { NextRequest, NextResponse } from "next/server"; // Importa clases para manejar solicitudes y respuestas

// Maneja las solicitudes GET para obtener un producto específico por su ID
export const GET = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    // Conecta a la base de datos
    await connectToDB();

    // Busca el producto por su ID y llena las colecciones asociadas
    const product = await Product.findById(params.productId).populate({
      path: "collections", // Llena la información de las colecciones
      model: Collection,
    });

    // Verifica si el producto existe
    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }), // Mensaje de error si no se encuentra el producto
        { status: 404 } // Código de estado 404
      );
    }

    // Devuelve el producto en formato JSON con encabezados de control de acceso
    return new NextResponse(JSON.stringify(product), {
      status: 200, // Código de estado 200
      headers: {
        "Access-Control-Allow-Origin": `${process.env.ECOMMERCE_STORE_URL}`, // Permite el acceso desde el dominio especificado
        "Access-Control-Allow-Methods": "GET", // Métodos permitidos
        "Access-Control-Allow-Headers": "Content-Type", // Encabezados permitidos
      },
    });
  } catch (err) {
    console.log("[productId_GET]", err); // Registra el error en la consola
    return new NextResponse("Internal error", { status: 500 }); // Devuelve un error 500
  }
};

// Maneja las solicitudes POST para actualizar un producto específico por su ID
export const POST = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    // Obtiene el ID del usuario autenticado
    const { userId } = auth();

    // Verifica si el usuario está autenticado
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 }); // Devuelve un error 401 si no está autorizado
    }

    // Conecta a la base de datos
    await connectToDB();

    // Busca el producto por su ID
    const product = await Product.findById(params.productId);

    // Verifica si el producto existe
    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }), // Mensaje de error si no se encuentra el producto
        { status: 404 } // Código de estado 404
      );
    }

    // Obtiene los datos del cuerpo de la solicitud
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

    // Verifica si se han proporcionado todos los datos necesarios
    if (!title || !description || !media || !category || !price || !expense) {
      return new NextResponse("Not enough data to create a new product", {
        status: 400, // Devuelve un error 400 si faltan datos
      });
    }

    // Identifica colecciones agregadas y eliminadas
    const addedCollections = collections.filter(
      (collectionId: string) => !product.collections.includes(collectionId)
    ); // Nuevas colecciones que se agregarán

    const removedCollections = product.collections.filter(
      (collectionId: string) => !collections.includes(collectionId)
    ); // Colecciones que se eliminarán

    // Actualizar colecciones
    await Promise.all([
      // Actualizar colecciones agregadas con este producto
      ...addedCollections.map((collectionId: string) =>
        Collection.findByIdAndUpdate(collectionId, {
          $push: { products: product._id }, // Agrega el producto a la colección
        })
      ),

      // Actualizar colecciones eliminadas sin este producto
      ...removedCollections.map((collectionId: string) =>
        Collection.findByIdAndUpdate(collectionId, {
          $pull: { products: product._id }, // Elimina el producto de la colección
        })
      ),
    ]);

    // Actualiza el producto con los nuevos datos
    const updatedProduct = await Product.findByIdAndUpdate(
      product._id,
      {
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
      },
      { new: true } // Devuelve el producto actualizado
    ).populate({ path: "collections", model: Collection });

    await updatedProduct.save(); // Guarda los cambios

    return NextResponse.json(updatedProduct, { status: 200 }); // Devuelve el producto actualizado en formato JSON
  } catch (err) {
    console.log("[productId_POST]", err); // Registra el error en la consola
    return new NextResponse("Internal error", { status: 500 }); // Devuelve un error 500
  }
};

// Maneja las solicitudes DELETE para eliminar un producto específico por su ID
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    // Obtiene el ID del usuario autenticado
    const { userId } = auth();

    // Verifica si el usuario está autenticado
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 }); // Devuelve un error 401 si no está autorizado
    }

    // Conecta a la base de datos
    await connectToDB();

    // Busca el producto por su ID
    const product = await Product.findById(params.productId);

    // Verifica si el producto existe
    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }), // Mensaje de error si no se encuentra el producto
        { status: 404 } // Código de estado 404
      );
    }

    // Elimina el producto
    await Product.findByIdAndDelete(product._id);

    // Actualiza colecciones
    await Promise.all(
      product.collections.map((collectionId: string) =>
        Collection.findByIdAndUpdate(collectionId, {
          $pull: { products: product._id }, // Elimina el producto de cada colección
        })
      )
    );

    return new NextResponse(JSON.stringify({ message: "Product deleted" }), {
      status: 200, // Código de estado 200
    });
  } catch (err) {
    console.log("[productId_DELETE]", err); // Registra el error en la consola
    return new NextResponse("Internal error", { status: 500 }); // Devuelve un error 500
  }
};

// Establece el comportamiento de renderizado dinámico
export const dynamic = "force-dynamic";
