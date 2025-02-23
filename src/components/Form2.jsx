import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, set, push } from "firebase/database";
import app from "../Store/realtimeDB";
import { AuthProvider, useAuth } from "../contexts/getUser";
import { arrayUnion, doc, getFirestore, updateDoc } from "firebase/firestore";
import { FaPlus } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import Navbar from "./Navbar";
import toast from "react-hot-toast";

function Form2() {
  const userId = useAuth().id;
  const [userData, setUserData] = useState({
    firstname: "",
    questions: [{ id: uuidv4(), question: "", answer: [] }], // Initialize with one question
    _id: uuidv4(),
  });

  const handleQuestion = () => {
    setUserData((prevState) => ({
      ...prevState,
      questions: [
        ...prevState.questions,
        { id: uuidv4(), question: "", answer: [] },
      ],
    }));
  };

  const handleQuestionClear = (id) => {
    setUserData((prevState) => ({
      ...prevState,
      questions: prevState.questions.filter((q) => q.id !== id),
    }));
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userData.firstname == "") {
      toast.error("Name is required", {
        position: "top-center",
        duration: 2000,
      });
      return;
    }
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

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  // };

  const handleData = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name.startsWith("question")) {
      const id = name.split("question")[1];
      setUserData((prevState) => ({
        ...prevState,
        questions: prevState.questions.map((q) =>
          q.id === id ? { ...q, question: value } : q
        ),
      }));
    } else {
      setUserData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
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
                  className="font-extrabold drop-shadow-sm flex"
                  htmlFor="firstname"
                >
                  Product Name:<span className="text-red-500 text-sm">*</span>
                </label>
                <input
                  className="shadow-md py-1 px-2 m-2 rounded-md bg-blue-100 focus:outline-none focus:ring-[1.2px] ring-offset-red-300 ring-offset-0 ring-blue-500"
                  name="firstname"
                  type="text"
                  value={userData.firstname}
                  onChange={handleData}
                />
              </div>
              <p className="m-2 font-extrabold drop-shadow-sm flex items-center gap-5">
                Enter Your Questions{" "}
                <span className="cursor-pointer" onClick={handleQuestion}>
                  <FaPlus />
                </span>
              </p>

              {userData.questions.map((q, i) => (
                <div className="flex flex-col m-2" key={q.id}>
                  <label className="font-extrabold drop-shadow-sm flex">
                    Q.{i + 1}
                    <span className="text-red-500 text-sm">*</span>
                  </label>
                  <div className="flex items-center justify-between">
                    <input
                      className="w-full shadow-md py-1 px-2 m-2 rounded-md bg-blue-100 focus:outline-none focus:ring-[1.2px] ring-offset-red-300 ring-offset-0 ring-blue-500"
                      name={`question${q.id}`}
                      id=""
                      type="text"
                      value={q.question}
                      onChange={handleData}
                      required
                    />
                    <RxCross2
                      className="cursor-pointer"
                      onClick={() => handleQuestionClear(q.id)}
                    />
                  </div>
                </div>
              ))}

              <div className="flex flex-col justify-center items-center m-2">
                <button
                  className="border border-1 shadow-md border-blue-800 h-max px-3 py-1.5 rounded-3xl text-white font-mono font-bold text-md bg-blue-800 hover:bg-blue-100 hover:text-slate-900"
                  type="submit"
                  // onClick={saveData}
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
