import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET as string, {
  apiVersion: "2023-10-16",
});

export default stripe;
