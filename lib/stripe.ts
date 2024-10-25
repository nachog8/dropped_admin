import Stripe from "stripe";

// Crea una instancia de Stripe utilizando la clave secreta y especificando la versión de la API
export const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});