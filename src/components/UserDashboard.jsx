import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getDatabase, ref, get, remove } from "firebase/database";
import app from "../Store/realtimeDB";

function UserDashboard() {
  const { state } = useLocation()
  const navigate = useNavigate();
  console.log(state)

  const handleDelete = async() => {
    const db = getDatabase(app);
    const docRef = ref(db, `Database/${state.data.item._id}`);
    await remove(docRef);
    navigate('/Home')
  }


  let handleSubmit = () => {
    navigate("/review", {
      state: {
        data: state.data.item || state.data
      }
    });
  };
  return (
    <>
      <div>
          <div className="flex justify-left items-center flex-col border-2 shadow-sm w-52">
            {
              state.data.item ?
                Object.entries(state.data.item).map((key, index) => (
                  <p className="font-bold text-xl" key={index}>{key[1].firstname}</p>
                ))
                :
                <p className="font-bold text-xl">{state.data.firstname}</p>
            }
          </div>
      </div>
      <button onClick={handleDelete}>Delete Space</button>
      <button onClick={handleSubmit}>Review</button>
    </>
  );
}

export default UserDashboard;
