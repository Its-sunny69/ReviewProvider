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
  const [names, setNames] = useState({})
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



  const AnswerElements = () => {
    const questions = state.data.questions
    const names = {}
    questions.forEach((item, index) => {
      if (item.answers) {
        item.answers.forEach((answer, index) => {
          if (!names[answer.id]) names[answer.id] = []
          names[answer.id].push({ question: item.question, 'answer': answer.answer })
        })
      }
    });
    setNames(names)
  }

  useEffect(() => {
    AnswerElements();
  }, []);

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
      <div className="flex flex-wrap justify-evenly items-center p-4">
        {
          Object.entries(names).map(([key, value]) => (
            <div key={key} className="w-max h-max p-10 shadow-md border-2 border-slate-800 ">
              <p>{key}</p>
              {value.map((item) => (
                <div key={item.question}>
                  <p>{item.question}:{item.answer}</p>
                </div>
              ))}
            </div>
          ))
        }
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
