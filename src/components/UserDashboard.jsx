import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getDatabase, ref, get, remove } from "firebase/database";
import app, { store } from "../Store/realtimeDB";
import { AuthProvider, useAuth } from "../contexts/getUser";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";

function UserDashboard() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useAuth();
  console.log(state);

  const handleDelete = async () => {
    const db = getDatabase(app);
    const docRef = ref(
      db,
      `Database/${state.data.item ? state.data.item[0]._id : state.data._id}`
    );
    await remove(docRef)
      .then(async () => {
        const userRef = doc(store, "users", id);
        await updateDoc(userRef, {
          spaces: arrayRemove(
            state.data.item ? state.data.item[0]._id : state.data._id
          ),
        });
        navigate("/home");
      })
      .catch((error) => console.log(error));
  };

  let handleSubmit = () => {
    navigate("/review", {
      state: {
        data: state.data.item || state.data,
      },
    });
  };

  return (
    <>
      <div>
        <div className="flex justify-left items-center flex-col border-2 shadow-sm w-52">
          {state.data.item ? (
            Object.entries(state.data.item).map((key, index) => (
              <p className="font-bold text-xl" key={index}>
                {key[1].firstname}
              </p>
            ))
          ) : (
            <p className="font-bold text-xl">
              {state.data.firstname} Dashboard
            </p>
          )}
        </div>
      </div>
      <button onClick={handleDelete}>Delete Space</button>
      <br />
      <button onClick={handleSubmit}>Review</button>
      <div>
        {state.data.questions.map((item, index) => (
          <>
            <p>{item.question}</p>
            {item.answers.map((ans, idx) => (
              <p>{ans.answer}</p>
            ))}
          </>
        ))}
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <UserDashboard />
    </AuthProvider>
  );
}
