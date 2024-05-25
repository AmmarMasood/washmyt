import Stripe from "stripe";

const stripe = new Stripe(
  process.env.NEXT_PUBLIC_STRIPE_PROD_SECRET as string,
  {
    // @ts-ignore
    apiVersion: "2022-11-15",
  }
);

export default stripe;
