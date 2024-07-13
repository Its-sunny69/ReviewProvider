import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getDatabase, ref, get } from "firebase/database";
import app from "../Store/realtimeDB";

function UserDashboard() {
  const { state } = useLocation()
  const [userName, setUserName] = useState([]);

  let navigate = useNavigate();
  let handleSubmit = () => {
    navigate("/review", {
      state: {
        data: state.data.item || state.data
      }
    });
  };
  return (
    <>
      <p> Dashboard</p>
      <div>
        <li>
          <div className="flex justify-center items-center flex-col border-2 shadow-sm w-52 h-52 shadow-black">
            {
              state.data.item ?
                Object.entries(state.data.item).map((key, index) => (
                  <p className="font-bold text-xl" key={index}>{key[1].firstname}</p>
                ))
                :
                <p className="font-bold text-xl">{state.data.firstname}</p>
            }
          </div>
        </li>
      </div>
      <button onClick={handleSubmit}>Review</button>
    </>
  );
}

export default UserDashboard;
