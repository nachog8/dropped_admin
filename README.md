<p >
    <img width="100%" src="https://github.com/user-attachments/assets/7b177163-3f7e-48f7-a95e-e90149dc7852"> 
</p>

# Proyecto individual módulo Front End

## Aplicación eCommerce

## Características

- Como usuario Administrador:
  - Crear una cuenta distinguida por e-mail como tambien puede ingresar atravez de facebook y google.
  - Crear, editar, eliminar Productos.
  - Cread, editar, eliminar Colecciones.
  - Ver lista de productos y estadísticas básicas de ventas por mes.
  - Ver lista de usuarios.
  - Ver lista de ordenes de los clientes ademas de poder ves los detalles de cada una

## Tecnologías y frameworks utilizados

- Next.JS (14.1)
- TypeScript
- Tailwind CSS
- Clerk para autenticacion y administracion de usuarios
- Stripe para los pagos
- MongoDB para administracion de base de datos
- React-Hook-Form para validacion de formularios
- Shadcn UI para diseño de ui
- Cloudinary para carga y almacenamiento de imagenes

## Requisitos previos

- Node.js (v18.x +)
- npm (v10.x +)

## Instalación

1. Clonar repositorio

```bash
git clone https://github.com/nachog8/dropped_admin
```

2. Navegar a directorio raíz

```bash
cd dropped_admin
```

3. Instalar dependencias

```bash
npm install
```

4. Crear archivo `.env` y añadir a gitignore

```bash
touch .env
echo '.env' >> .gitignore
```

5. Añadir variables de entorno a `.env`:
<details>
<summary>(ver variables)</summary>

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bGl2aW5nLW1vY2Nhc2luLTQzLmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_pPJ1YTYv4TeSTZhcDnn2bhXYlN9lfgtGLqphfPjrpM

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dsblkemel

MONGODB_URL=mongodb+srv://nachog88:mDo4ZjVoRm42QSVP@dropped.5q6rs.mongodb.net/?retryWrites=true&w=majority&appName=Dropped

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51QCoaL2KDzwDXQNVIEf4nFlRDvFSBkocTVH6S4ET0spaoMjffqip1zyPmNJT0MwbQovueCLuhnXS8apWLkQOy3fR00vioTbFU1
NEXT_PUBLIC_STRIPE_SECRET_KEY=sk_test_51QCoaL2KDzwDXQNVttE9pFTCU9RPbqq5mCFrNxJOFcjjXKJCEVpQv6zRTRtu1xox51369DuOYqoG2bMLpIHg9X9f00XALcmwkR

ECOMMERCE_STORE_URL=http://localhost:3001

STRIPE_WEBHOOK_SECRET=whsec_a0344d3b34fe458a7d6a5c7e22b1d9400b4a6457faa710d37f094005c7ec8cfd

ADMIN_DASHBOARD_URL=http://localhost:3000
```

</details>

6. Ejecutar modo de desarrollo.

```bash
npm run dev
```

> Navegar a la App expuesta en [http://localhost:3000](http://localhost:3000)

## Despliegue demo: https://dropped-admin.vercel.app/
