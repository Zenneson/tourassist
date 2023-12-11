"use client";
import { doc, onSnapshot } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, firestore } from "./firebase";

// User context
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
    throw new Error("Provider: No USER data found at the moment");
  }
  return context;
};

// State variables context
const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [active, setActive] = useState(-1);
  const [panelShow, setPanelShow] = useState(false);
  const [mainMenuOpened, setMainMenuOpened] = useState(false);
  const [listOpened, setListOpened] = useState(false);
  const [searchOpened, setSearchOpened] = useState(false);

  const value = {
    active,
    setActive,
    panelShow,
    setPanelShow,
    mainMenuOpened,
    setMainMenuOpened,
    listOpened,
    setListOpened,
    searchOpened,
    setSearchOpened,
  };

  return (
    <StateContext.Provider value={value}>{children}</StateContext.Provider>
  );
};

export const useStateContext = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("Provider: No STATE VARIABLE data found at the moment");
  }
  return context;
};

// Area context and map related variables
const AreaContext = createContext();

export const AreaProvider = ({ children }) => {
  const [area, setArea] = useState({ label: "" });

  const value = {
    area,
    setArea,
  };

  return <AreaContext.Provider value={value}>{children}</AreaContext.Provider>;
};

export const useAreaContext = () => {
  const context = useContext(AreaContext);
  if (!context) {
    throw new Error("Provider: No AREA data found at the moment");
  }
  return context;
};
