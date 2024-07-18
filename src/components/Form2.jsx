import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, set, push } from "firebase/database";
import app from "../Store/realtimeDB";
import { AuthProvider, useAuth } from "../contexts/getUser";
import {
  arrayUnion,
  doc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import Navbar from "./Navbar";

function Form2() {
  const userId = useAuth().id;
  const [userData, setUserData] = useState({
    firstname: "",
    questions: [],
    _id: uuidv4(),
  });

  const questionArray = [1, 2, 3];
  useEffect(() => {
    const initialQuestions = [];
    questionArray.forEach((_, index) => {
      initialQuestions.push({ question: "", answer: [] });
    });
    setUserData((prevState) => ({
      ...prevState,
      questions: initialQuestions,
    }));
  }, []);

  const navigate = useNavigate();

  const saveData = async () => {
    const db = getFirestore(app);
    const db1 = getDatabase(app);
    const userDocRef = doc(db, "users", userId);
    const newDocRef = push(ref(db1, `Database/${userData._id}`));
    set(newDocRef, {
      formLink: "",
      firstname: userData.firstname,
      questions: userData.questions,
    })
      .then(async () => {
        if (userId) {
          console.log(userData._id);
          await updateDoc(userDocRef, {
            spaces: arrayUnion(userData._id),
          });
          alert("Data Saved");
          navigate("/user-dashboard", {
            state: {
              data: userData,
            },
          });
        }
      })
      .catch((error) => {
        console.log(error);
        alert("error", error.message);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleData = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name.startsWith("question")) {
      const questionIndex = parseInt(name.split("question")[1]) - 1;
      setUserData((prevState) => ({
        ...prevState,
        questions: prevState.questions.map((q, index) =>
          index === questionIndex ? { ...q, question: value, answer: [] } : q
        ),
      }));
    } else {
      setUserData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
    console.log(userData)
  };


  return (
    <>
    <div className="w-full h-dvh">
    <Navbar />
      <form
        className="w-2/5 border flex flex-col"
        action=""
        onClick={handleSubmit}
      >
        <label htmlFor="">Name: </label>
        <input
          className="border border-black"
          name="firstname"
          type="text"
          value={userData.firstname}
          onChange={handleData}
        />

        <p>Enter Your Questions</p>

        {questionArray.map((n) => {
          return (
            <div key={n}>
              <label htmlFor="">Q{n}</label>
              <input
                className="border border-black"
                name={`question${n}`}
                id=""
                type="text"
                value={userData.questions[`question${n}`]}
                onChange={handleData}
                rows={10}
                column={10}
              ></input>
            </div>
          );
        })}

        <button type="submit" onClick={saveData}>
          Submit
        </button>
      </form>
      </div>
      </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Form2 />
    </AuthProvider>
  );
}
