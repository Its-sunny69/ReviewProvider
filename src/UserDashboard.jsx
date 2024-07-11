import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, get } from "firebase/database";
import app from "./Store/realtimeDB";

function UserDashboard() {
  const [userName, setUserName] = useState([]);

  useEffect(() => {
    const fatchData = async () => {
      const db = getDatabase(app);
      const dbref = ref(db, "Database/Space");
      const snapshot = await get(dbref);
      if (snapshot.exists) {
        setUserName(Object.values(snapshot.val()));
      } else {
        console.log(error);
      }
    };

    fatchData();
  }, []);

  console.log(userName);
  console.log(userName[0]["firstname"])


  let navigate = useNavigate();
  let handleSubmit = () => {
    navigate("/review");
  };
  return (
    <>
      <p>{userName[0]["firstname"]} Dashboard</p>
      <button onClick={handleSubmit}>Submit</button>
    </>
  );
}

export default UserDashboard;
