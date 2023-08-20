import { Duffel } from "@duffel/api";

export default async function ConfirmPayment(req, res) {
  const duffel = new Duffel({
    token: process.env.NEXT_PUBLIC_DUFFEL_AC,
  });

  console.log(req.body);

  try {
    const paymentIntent = await duffel.paymentIntents.confirm(req.body);
    res.status(200).json(paymentIntent);
  } catch (error) {
    res.status(500).json({ error: "Failed to confirm payment intent" });
  }
}
