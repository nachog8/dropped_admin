"use client"; // Indica que este componente se ejecutará en el cliente

import { zodResolver } from "@hookform/resolvers/zod"; // Resolver de zod para la validación de formularios
import { useForm } from "react-hook-form"; // Hook para manejar formularios
import { z } from "zod"; // Biblioteca para validación de esquemas
import { useRouter } from "next/navigation"; // Hook para la navegación en Next.js

import { Separator } from "../ui/separator"; // Componente de separación visual
import { Button } from "@/components/ui/button"; // Componente de botón
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"; // Componentes de formulario personalizados
import { Input } from "@/components/ui/input"; // Componente de entrada de texto
import { Textarea } from "../ui/textarea"; // Componente de área de texto
import ImageUpload from "../custom ui/ImageUpload"; // Componente personalizado para subir imágenes
import { useEffect, useState } from "react"; // Hooks de React para manejar el estado y efectos
import toast from "react-hot-toast"; // Biblioteca para notificaciones
import Delete from "../custom ui/Delete"; // Componente para eliminar un producto
import MultiText from "../custom ui/MultiText"; // Componente para entradas de texto múltiples
import MultiSelect from "../custom ui/MultiSelect"; // Componente para selección múltiple
import Loader from "../custom ui/Loader"; // Componente de carga

// Esquema de validación para el formulario de producto
const formSchema = z.object({
  title: z.string().min(2).max(20), // Título debe ser una cadena de 2 a 20 caracteres
  description: z.string().min(2).max(500).trim(), // Descripción con un mínimo de 2 y máximo de 500 caracteres
  media: z.array(z.string()), // Array de cadenas para imágenes
  category: z.string(), // Categoría del producto
  collections: z.array(z.string()), // Array de identificadores de colecciones
  tags: z.array(z.string()), // Array de etiquetas
  sizes: z.array(z.string()), // Array de tamaños
  colors: z.array(z.string()), // Array de colores
  price: z.coerce.number().min(0.1), // Precio debe ser un número mayor a 0.1
  expense: z.coerce.number().min(0.1), // Costo debe ser un número mayor a 0.1
});

// Propiedades del componente ProductForm
interface ProductFormProps {
  initialData?: ProductType | null; //Debe tener "?" para que sea opcional
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData }) => {
  const router = useRouter(); // Hook para navegación

  const [loading, setLoading] = useState(true); // Estado de carga
  const [collections, setCollections] = useState<CollectionType[]>([]); // Estado para colecciones

  // Función para obtener las colecciones desde la API
  const getCollections = async () => {
    try {
      const res = await fetch("/api/collections", {
        method: "GET", // Método GET para obtener datos
      });
      const data = await res.json(); // Convierte la respuesta a JSON
      setCollections(data); // Establece las colecciones en el estado
      setLoading(false); // Cambia el estado de carga a falso
    } catch (err) {
      console.log("[collections_GET]", err); // Muestra errores en la consola
      toast.error("¡Algo salió mal! Inténtalo de nuevo."); // Notificación de error
    }
  };

  // useEffect para cargar colecciones al montar el componente
  useEffect(() => {
    getCollections(); // Llama a la función para obtener colecciones
  }, []);

  // Configuración del formulario con useForm
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema), // Usa el resolver de zod
    defaultValues: initialData
      ? {
          ...initialData,
          collections: initialData.collections.map(
            (collection) => collection._id // Mapea las colecciones a sus IDs
          ),
        }
      : {
          title: "", // Valores por defecto si no hay datos iniciales
          description: "",
          media: [],
          category: "",
          collections: [],
          tags: [],
          sizes: [],
          colors: [],
          price: 0.1,
          expense: 0.1,
        },
  });

  // Maneja la presión de teclas en los campos
  const handleKeyPress = (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Previene el comportamiento por defecto al presionar Enter
    }
  };

  // Función para manejar el envío del formulario
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true); // Cambia el estado de carga a verdadero
      const url = initialData
        ? `/api/products/${initialData._id}` // Si hay datos iniciales, actualiza el producto
        : "/api/products"; // Si no, crea un nuevo producto
      const res = await fetch(url, {
        method: "POST", // Método POST para enviar datos
        body: JSON.stringify(values), // Convierte los valores a JSON
      });
      if (res.ok) {
        setLoading(false); // Cambia el estado de carga a falso
        toast.success(`Producto ${initialData ? "actualizado" : "creado"}`); // Notificación de éxito
        window.location.href = "/products"; // Redirecciona a la lista de productos
        router.push("/products"); // Redirige usando el router
      }
    } catch (err) {
      console.log("[products_POST]", err); // Muestra errores en la consola
      toast.error("¡Algo salió mal! Inténtalo de nuevo."); // Notificación de error
    }
  };

  // Renderiza el formulario
  return loading ? (
    <Loader /> // Muestra el componente de carga si está en estado de carga
  ) : (
    <div className="p-10">
      {initialData ? (
        <div className="flex items-center justify-between">
          <p className="text-heading2-bold">Editar Producto</p>
          <Delete id={initialData._id} item="product" />
        </div>
      ) : (
        <p className="text-heading2-bold">Crear Producto</p>
      )}
      <Separator className="bg-grey-1 mt-4 mb-7" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titulo</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Titulo"
                    {...field}
                    onKeyDown={handleKeyPress}
                  />
                </FormControl>
                <FormMessage className="text-red-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descripción"
                    {...field}
                    rows={5}
                    onKeyDown={handleKeyPress}
                  />
                </FormControl>
                <FormMessage className="text-red-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="media"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imagen</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={(url) => field.onChange([...field.value, url])}
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.filter((image) => image !== url),
                      ])
                    }
                  />
                </FormControl>
                <FormMessage className="text-red-1" />
              </FormItem>
            )}
          />

          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Precio"
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expense"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Costo ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Costo"
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Categoria"
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Etiquetas</FormLabel>
                  <FormControl>
                    <MultiText
                      placeholder="Etiquetas"
                      value={field.value}
                      onChange={(tag) => field.onChange([...field.value, tag])}
                      onRemove={(tagToRemove) =>
                        field.onChange([
                          ...field.value.filter((tag) => tag !== tagToRemove),
                        ])
                      }
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
            {collections.length > 0 && (
              <FormField
                control={form.control}
                name="collections"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Colecciones</FormLabel>
                    <FormControl>
                      <MultiSelect
                        placeholder="Colecciones"
                        collections={collections}
                        value={field.value}
                        onChange={(_id) =>
                          field.onChange([...field.value, _id])
                        }
                        onRemove={(idToRemove) =>
                          field.onChange([
                            ...field.value.filter(
                              (collectionId) => collectionId !== idToRemove
                            ),
                          ])
                        }
                      />
                    </FormControl>
                    <FormMessage className="text-red-1" />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="colors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Colores</FormLabel>
                  <FormControl>
                    <MultiText
                      placeholder="Colores"
                      value={field.value}
                      onChange={(color) =>
                        field.onChange([...field.value, color])
                      }
                      onRemove={(colorToRemove) =>
                        field.onChange([
                          ...field.value.filter(
                            (color) => color !== colorToRemove
                          ),
                        ])
                      }
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sizes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tamaños</FormLabel>
                  <FormControl>
                    <MultiText
                      placeholder="Tamaños"
                      value={field.value}
                      onChange={(size) =>
                        field.onChange([...field.value, size])
                      }
                      onRemove={(sizeToRemove) =>
                        field.onChange([
                          ...field.value.filter(
                            (size) => size !== sizeToRemove
                          ),
                        ])
                      }
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-10">
            <Button type="submit" className="bg-blue-1 text-white">
              Enviar
            </Button>
            <Button
              type="button"
              onClick={() => router.push("/products")}
              className="bg-red-1 text-white"
            >
              Descartar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProductForm; // Exporta el componente
