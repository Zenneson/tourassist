import { firestore } from "@libs/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function getAllTrips(userEmail) {
  const queryData = collection(firestore, "users", userEmail, "trips");
  const querySnapshot = await getDocs(queryData);
  return querySnapshot.docs.map((doc) => doc.data());
}
