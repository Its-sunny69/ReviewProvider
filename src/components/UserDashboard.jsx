import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getDatabase, ref, get } from "firebase/database";
import app from "../Store/realtimeDB";

function UserDashboard() {
  const { state } = useLocation()
  const [userName, setUserName] = useState([]);

  // useEffect(() => {
  //   const fatchData = async () => {
  //     const db = getDatabase(app);
  //     const dbref = ref(db, "Database");
  //     const snapshot = await get(dbref);
  //     if (snapshot.exists) {
  //       setUserName(Object.values(snapshot.val()));
  //     } else {
  //       console.log(error);
  //     }
  //   };

  //   fatchData();
  // }, []);

  // console.log(userName);
  // console.log(userName[0]["firstname"])



  let navigate = useNavigate();
  let handleSubmit = () => {
    navigate("/review", {
      state: {
        data: state.data.item
      }
    });
  };
  return (
    <>
      <p> Dashboard</p>
      <div>
        <li>
          <div className="flex justify-center items-center flex-col border-2 shadow-sm w-52 h-52 shadow-black">
            {Object.entries(state.data.item).map((key) => (
              key[1].firstname &&
              <p className="font-bold text-xl" key={state.data.item}>{key[1].firstname}fdk</p>
            ))}
          </div>
        </li>
      </div>
      <button onClick={handleSubmit}>Review</button>
    </>
  );
}

export default UserDashboard;
