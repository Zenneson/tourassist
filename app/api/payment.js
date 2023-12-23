import { Duffel } from "@duffel/api";

const duffelAccessKey =
  "projects/tourassist-836db/secrets/NEXT_PUBLIC_DUFFEL_AC/versions/latest" ||
  process.env.NEXT_PUBLIC_DUFFEL_AC ||
  secrets.NEXT_PUBLIC_DUFFEL_AC;

export default async function CreatePayment(req, res) {
  const duffel = new Duffel({
    token: duffelAccessKey,
    debug: { verbose: true },
  });

  const formatDonation = (amount) => {
    return amount.toFixed(2);
  };
  const donation = formatDonation(req.body);

  try {
    const paymentIntent = await duffel.paymentIntents.create({
      currency: "USD",
      amount: donation,
    });
    res.status(200).json(paymentIntent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
}
