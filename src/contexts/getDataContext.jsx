import React, { createContext, useState, useEffect, useContext } from "react";
import { getDatabase, ref, get } from "firebase/database";
import app from "../Store/realtimeDB";
import { AuthProvider, useAuth } from "./getUser";

const dataContext = createContext();

function DataProvider({ children }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuth();

  const fetchData = async (path) => {
    const db = getDatabase(app);
    const dbRef = ref(db, `Database/${path}`);
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      const fetchedData = Object.values(snapshot.val());
      const updatedData = fetchedData.map((item) => ({
        ...item,
        _id: path,
      }));
      setData((prev) => [...prev, updatedData]);
    } else {
      //console.log("Fetch failed");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData) {
      //console.log("userData", userData)
      userData.spaces &&
        userData.spaces.forEach((element) => {
          fetchData(element);
        });
      setLoading(false);
    }
  }, [userData]);

  return (
    <AuthProvider>
      <dataContext.Provider value={{ data, loading }}>
        {children}
      </dataContext.Provider>
    </AuthProvider>
  );
}
const useData = () => {
  const context = useContext(dataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export { DataProvider, useData };
