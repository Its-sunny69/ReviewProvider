import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, set, push } from "firebase/database";
import app from "../Store/realtimeDB";
import { AuthProvider, useAuth } from "../contexts/getUser";
import { arrayUnion, doc, getFirestore, updateDoc } from "firebase/firestore";
import Navbar from "./Navbar";
import toast from "react-hot-toast";

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
          //console.log(userData._id);
          await updateDoc(userDocRef, {
            spaces: arrayUnion(userData._id),
          });
          toast.success("Space & Form Created Successfully", {
            position: "top-center",
            duration: 2000,
          });
          navigate("/user-dashboard", {
            state: {
              data: userData,
            },
          });
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message, {
          position: "top-center",
          duration: 2000,
        });
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
    //console.log(userData);
  };

  return (
    <>
      <div className="w-full h-dvh">
        <Navbar />
        <div className="w-full h-svh flex justify-center items-center bg-slate-100">
          <div className="sm:w-2/6 my-5 text-xl flex flex-col border-none p-5 shadow-lg rounded-md backdrop-blur-sm bg-blue-200">
            <form action="" onSubmit={handleSubmit}>
              <div className="flex flex-col m-2">
                <label
                  className=" font-extrabold drop-shadow-sm flex"
                  htmlFor="firstname"
                >
                  Name:<span className="text-red-500 text-sm">*</span>
                </label>
                <input
                  className="shadow-md py-1 px-2 m-2 rounded-md bg-blue-100 focus:outline-none focus:ring-[1.2px] ring-offset-red-300 ring-offset-0 ring-blue-500"
                  name="firstname"
                  type="text"
                  value={userData.firstname}
                  onChange={handleData}
                  required
                />
              </div>
              <p className="m-2 font-extrabold drop-shadow-sm">
                Enter Your Questions
              </p>

              {questionArray.map((n) => {
                return (
                  <div className="flex flex-col m-2" key={n}>
                    <label
                      className="font-extrabold drop-shadow-sm flex "
                      htmlFor=""
                    >
                      Q.{n}
                      <span className="text-red-500 text-sm">*</span>
                    </label>
                    <input
                      className="shadow-md py-1 px-2 m-2 rounded-md bg-blue-100 focus:outline-none focus:ring-[1.2px] ring-offset-red-300 ring-offset-0 ring-blue-500"
                      name={`question${n}`}
                      id=""
                      type="text"
                      value={userData.questions[`question${n}`]}
                      onChange={handleData}
                      rows={10}
                      column={10}
                      required
                    ></input>
                  </div>
                );
              })}

              <div className="flex flex-col justify-center items-center m-2">
                <button
                  className=" border border-1 shadow-md border-blue-800 h-max px-3 py-1.5 rounded-3xl text-white font-mono font-bold text-md bg-blue-800 hover:bg-blue-100 hover:text-slate-900"
                  type="submit"
                  onClick={saveData}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
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
