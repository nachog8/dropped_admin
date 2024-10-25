// Importación de tipos para solicitudes y respuestas de Next.js
import { NextRequest, NextResponse } from "next/server";
// Importación de la función de autenticación de Clerk
import { auth } from "@clerk/nextjs";

// Importación de la función para conectar a la base de datos MongoDB
import { connectToDB } from "@/lib/mongoDB";
// Importación del modelo de colección y producto
import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";

// Manejo de la solicitud GET para obtener una colección por ID
export const GET = async (
  req: NextRequest,
  { params }: { params: { collectionId: string } } // Desestructuración de los parámetros de la solicitud
) => {
  try {
    // Conectar a la base de datos
    await connectToDB();

    // Buscar la colección por ID y poblar los productos relacionados
    const collection = await Collection.findById(params.collectionId).populate({ path: "products", model: Product });

    // Si la colección no se encuentra, retornar un error 404
    if (!collection) {
      return new NextResponse(
        JSON.stringify({ message: "Collection not found" }), // Mensaje de error
        { status: 404 } // Código de estado 404
      );
    }

    // Retornar la colección en formato JSON con un código de estado 200
    return NextResponse.json(collection, { status: 200 });
  } catch (err) {
    // Manejo de errores y log de la excepción
    console.log("[collectionId_GET]", err);
    return new NextResponse("Internal error", { status: 500 }); // Código de estado 500 para errores internos
  }
};

// Manejo de la solicitud POST para actualizar una colección
export const POST = async (
  req: NextRequest,
  { params }: { params: { collectionId: string } } // Desestructuración de los parámetros de la solicitud
) => {
  try {
    // Obtener el ID del usuario autenticado
    const { userId } = auth();

    // Verificar si el usuario está autenticado
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 }); // Retornar 401 si no está autorizado
    }

    // Conectar a la base de datos
    await connectToDB();

    // Buscar la colección por ID
    let collection = await Collection.findById(params.collectionId);

    // Si la colección no se encuentra, retornar un error 404
    if (!collection) {
      return new NextResponse("Collection not found", { status: 404 });
    }

    // Obtener los datos del cuerpo de la solicitud
    const { title, description, image } = await req.json();

    // Verificar que se proporcionen el título y la imagen
    if (!title || !image) {
      return new NextResponse("Title and image are required", { status: 400 }); // Retornar 400 si faltan datos
    }

    // Actualizar la colección con los nuevos datos
    collection = await Collection.findByIdAndUpdate(
      params.collectionId,
      { title, description, image },
      { new: true } // Retornar el documento actualizado
    );

    // Guardar los cambios en la colección
    await collection.save();

    // Retornar la colección actualizada en formato JSON con un código de estado 200
    return NextResponse.json(collection, { status: 200 });
  } catch (err) {
    // Manejo de errores y log de la excepción
    console.log("[collectionId_POST]", err);
    return new NextResponse("Internal error", { status: 500 }); // Código de estado 500 para errores internos
  }
};

// Manejo de la solicitud DELETE para eliminar una colección
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { collectionId: string } } // Desestructuración de los parámetros de la solicitud
) => {
  try {
    // Obtener el ID del usuario autenticado
    const { userId } = auth();

    // Verificar si el usuario está autenticado
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 }); // Retornar 401 si no está autorizado
    }

    // Conectar a la base de datos
    await connectToDB();

    // Eliminar la colección por ID
    await Collection.findByIdAndDelete(params.collectionId);

    // Actualizar los productos para eliminar la referencia a la colección eliminada
    await Product.updateMany(
      { collections: params.collectionId },
      { $pull: { collections: params.collectionId } } // Eliminar la colección de la lista de colecciones de cada producto
    );

    // Retornar un mensaje de éxito con un código de estado 200
    return new NextResponse("Collection is deleted", { status: 200 });
  } catch (err) {
    // Manejo de errores y log de la excepción
    console.log("[collectionId_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 }); // Código de estado 500 para errores internos
  }
};

// Configuración para que la función se ejecute de manera dinámica
export const dynamic = "force-dynamic";
