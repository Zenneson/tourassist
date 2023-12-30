import { firestore } from "@libs/firebase";
import { collectionGroup, getDocs } from "firebase/firestore";

export async function getTripData(title) {
  const query = collectionGroup(firestore, "trips");
  const querySnapshot = await getDocs(query);
  const tripDoc = querySnapshot.docs.find((doc) => doc.id === title);
  if (!tripDoc) {
    throw new Error("No document found with the matching 'title'");
  }
  const tripData = tripDoc.data();

  return tripData;
}
