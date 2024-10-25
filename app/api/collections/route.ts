// Importación de la función para conectar a la base de datos MongoDB
import { connectToDB } from "@/lib/mongoDB";
// Importación de la función de autenticación de Clerk
import { auth } from "@clerk/nextjs";
// Importación de tipos para solicitudes y respuestas de Next.js
import { NextRequest, NextResponse } from "next/server";

// Importación del modelo de colección
import Collection from "@/lib/models/Collection";

// Manejo de la solicitud POST para crear una nueva colección
export const POST = async (req: NextRequest) => {
  try {
    // Obtener el ID del usuario autenticado
    const { userId } = auth()

    // Verificar si el usuario está autenticado
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 }); // Retornar 403 si no está autorizado
    }

    // Conectar a la base de datos
    await connectToDB();

    // Obtener los datos del cuerpo de la solicitud
    const { title, description, image } = await req.json();

    // Verificar si ya existe una colección con el mismo título
    const existingCollection = await Collection.findOne({ title });

    if (existingCollection) {
      return new NextResponse("Collection already exists", { status: 400 }); // Retornar 400 si la colección ya existe
    }

    // Verificar que se proporcionen el título y la imagen
    if (!title || !image) {
      return new NextResponse("Title and image are required", { status: 400 }); // Retornar 400 si faltan datos
    }

    // Crear una nueva colección con los datos proporcionados
    const newCollection = await Collection.create({
      title,
      description,
      image,
    });

    // Guardar la nueva colección en la base de datos
    await newCollection.save();

    // Retornar la nueva colección en formato JSON con un código de estado 200
    return NextResponse.json(newCollection, { status: 200 });
  } catch (err) {
    // Manejo de errores y log de la excepción
    console.log("[collections_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 }); // Código de estado 500 para errores internos
  }
}

// Manejo de la solicitud GET para obtener todas las colecciones
export const GET = async (req: NextRequest) => {
  try {
    // Conectar a la base de datos
    await connectToDB();

    // Obtener todas las colecciones y ordenarlas por fecha de creación en orden descendente
    const collections = await Collection.find().sort({ createdAt: "desc" });

    // Retornar las colecciones en formato JSON con un código de estado 200
    return NextResponse.json(collections, { status: 200 });
  } catch (err) {
    // Manejo de errores y log de la excepción
    console.log("[collections_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 }); // Código de estado 500 para errores internos
  }
}

// Configuración para que la función se ejecute de manera dinámica
export const dynamic = "force-dynamic";
