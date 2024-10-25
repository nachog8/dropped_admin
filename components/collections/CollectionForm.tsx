"use client"; // Indica que este archivo se ejecuta en el cliente

import { zodResolver } from "@hookform/resolvers/zod"; // Importa el resolver de Zod para la validación
import { useForm } from "react-hook-form"; // Importa el hook useForm de react-hook-form
import { z } from "zod"; // Importa Zod para la validación de esquemas
import { useRouter } from "next/navigation"; // Importa el router de Next.js para la navegación

import { Separator } from "../ui/separator"; // Importa el componente Separator
import { Button } from "@/components/ui/button"; // Importa el componente Button
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"; // Importa componentes de formulario
import { Input } from "@/components/ui/input"; // Importa el componente Input
import { Textarea } from "../ui/textarea"; // Importa el componente Textarea
import ImageUpload from "../custom ui/ImageUpload"; // Importa el componente de carga de imágenes
import { useState } from "react"; // Importa el hook useState para manejar el estado
import toast from "react-hot-toast"; // Importa el sistema de notificaciones
import Delete from "../custom ui/Delete"; // Importa el componente de eliminación

// Define el esquema de validación usando Zod
const formSchema = z.object({
  title: z.string().min(2).max(20), // Título: mínimo 2 caracteres, máximo 20
  description: z.string().min(2).max(500).trim(), // Descripción: mínimo 2, máximo 500 caracteres
  image: z.string(), // Imagen: cadena
});

// Propiedades del componente CollectionForm
interface CollectionFormProps {
  initialData?: CollectionType | null; // Datos iniciales opcionales para editar
}

// Componente CollectionForm
const CollectionForm: React.FC<CollectionFormProps> = ({ initialData }) => {
  const router = useRouter(); // Inicializa el router
  const [loading, setLoading] = useState(false); // Estado de carga

  // Configuración del formulario
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema), // Usa Zod como validador
    defaultValues: initialData
      ? initialData // Si hay datos iniciales, úsalos
      : {
          title: "",
          description: "",
          image: "",
        },
  });

  // Maneja la tecla Enter en el formulario
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Previene el envío del formulario al presionar Enter
    }
  }

  // Función de envío del formulario
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true); // Indica que se está cargando
      const url = initialData
        ? `/api/collections/${initialData._id}` // URL para editar
        : "/api/collections"; // URL para crear
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(values), // Envía los datos del formulario
      });
      if (res.ok) {
        setLoading(false);
        toast.success(`Colección ${initialData ? "actualizada" : "creada"}`); // Muestra una notificación de éxito
        window.location.href = "/collections"; // Redirige a la lista de colecciones
        router.push("/collections"); // Usa el router para redirigir
      }
    } catch (err) {
      console.log("[collections_POST]", err); // Maneja errores en la consola
      toast.error("¡Algo salió mal! Inténtalo de nuevo."); // Muestra una notificación de error
    }
  };

  return (
    <div className="p-10"> {/* Contenedor del formulario */}
      {initialData ? (
        <div className="flex items-center justify-between">
          <p className="text-heading2-bold">Editar Colección</p>
          <Delete id={initialData._id} item="collection" /> {/* Componente para eliminar */}
        </div>
      ) : (
        <p className="text-heading2-bold">Crear Colección</p>
      )}
      <Separator className="bg-grey-1 mt-4 mb-7" /> {/* Separador visual */}
      <Form {...form}> {/* Componente del formulario */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8"> {/* Maneja el envío */}
          {/* Campo para el título */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titulo</FormLabel>
                <FormControl>
                  <Input placeholder="Titulo" {...field} onKeyDown={handleKeyPress} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Campo para la descripción */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea placeholder="Descripción" {...field} rows={5} onKeyDown={handleKeyPress} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Campo para la carga de imágenes */}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imagen</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []} // Carga de imágenes
                    onChange={(url) => field.onChange(url)} // Maneja cambios en la imagen
                    onRemove={() => field.onChange("")} // Maneja eliminación de imagen
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Botones de enviar y descartar */}
          <div className="flex gap-10">
            <Button type="submit" className="bg-blue-1 text-white">
              Enviar
            </Button>
            <Button
              type="button"
              onClick={() => router.push("/collections")} // Redirige al cancelar
              className="bg-blue-1 text-white"
            >
              Descartar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CollectionForm; // Exporta el componente
