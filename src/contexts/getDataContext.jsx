import React, { createContext, useState, useEffect, useContext } from 'react';
import { getDatabase, ref, get } from "firebase/database";
import app from "../Store/realtimeDB";

const dataContext = createContext();

function DataProvider({ children }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const db = getDatabase(app);
    const dbRef = ref(db, `Database`);
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      setData(Object.values(snapshot.val()));
      setLoading(false);
    } else {
      console.log("Fetch failed");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <dataContext.Provider value={{ data, loading }}>
      {children}
    </dataContext.Provider>
  );
}
const useData = () => {
  const context = useContext(dataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};


export { DataProvider, useData };