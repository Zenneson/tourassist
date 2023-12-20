import { firestore } from "@libs/firebase";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
import { mutate } from "swr";

export async function getAllTrips(userEmail) {
  const queryData = collection(firestore, "users", userEmail, "trips");
  const querySnapshot = await getDocs(queryData);
  return querySnapshot.docs.map((doc) => doc.data());
}

export function useFirestoreListener() {
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, "trips"),
      (snapshot) => {
        const trips = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        mutate("trips", trips, false);
      }
    );

    return () => unsubscribe();
  }, []);
}
