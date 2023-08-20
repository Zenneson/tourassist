import { Duffel } from "@duffel/api";

export default async function DuffelPayments(req, res) {
  const duffel = new Duffel({
    token: process.env.NEXT_PUBLIC_DUFFEL_AC,
  });

  const formatDonation = (amount) => {
    return amount.toFixed(2);
  };
  const donation = formatDonation(req.body);
  console.log(donation);

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
