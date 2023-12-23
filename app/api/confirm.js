import { Duffel } from "@duffel/api";

const duffelAccessKey =
  "projects/tourassist-836db/secrets/NEXT_PUBLIC_DUFFEL_AC/versions/latest" ||
  process.env.NEXT_PUBLIC_DUFFEL_AC ||
  secrets.NEXT_PUBLIC_DUFFEL_AC;

export default async function ConfirmPayment(req, res) {
  const duffel = new Duffel({
    token: duffelAccessKey,
    debug: { verbose: true },
  });

  try {
    const paymentIntent = await duffel.paymentIntents.confirm(req.body);
    res.status(200).json(paymentIntent);
  } catch (error) {
    res.status(500).json({ error: "Failed to confirm payment intent" });
  }
}
