import { createContext, useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, firestore } from "./firebase";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userAuth) => {
      setLoading(false);

      if (userAuth?.email) {
        const docRef = doc(firestore, "users", userAuth.email);

        const unsubscribeFirestore = onSnapshot(
          docRef,
          (docSnap) => {
            if (docSnap.exists()) {
              const userData = docSnap.data();
              setUser({ ...userAuth, ...userData });
            } else {
              console.log("No such document!");
            }
          },
          (error) => {
            console.error("Error getting document:", error);
          }
        );

        return () => unsubscribeFirestore();
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
