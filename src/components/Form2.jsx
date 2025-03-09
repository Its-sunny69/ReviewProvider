import React, { useState } from "react";
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
    questions: [{ id: uuidv4(), question: "", type: "text", options: [] }],
    _id: uuidv4(),
  });

  const navigate = useNavigate();

  const handleQuestion = () => {
    setUserData((prevState) => ({
      ...prevState,
      questions: [
        ...prevState.questions,
        { id: uuidv4(), question: "", type: "text", options: [] },
      ],
    }));
  };

  const handleQuestionClear = (id) => {
    setUserData((prevState) => ({
      ...prevState,
      questions: prevState.questions.filter((q) => q.id !== id),
    }));
  };

  const handleData = (e, id) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      questions: prevState.questions.map((q) =>
        q.id === id ? { ...q, [name]: value } : q
      ),
    }));
  };

  const handleAddOption = (id) => {
    setUserData((prevState) => ({
      ...prevState,
      questions: prevState.questions.map((q) =>
        q.id === id ? { ...q, options: [...q.options, ""] } : q
      ),
    }));
  };

  const handleOptionChange = (id, index, value) => {
    setUserData((prevState) => ({
      ...prevState,
      questions: prevState.questions.map((q) =>
        q.id === id
          ? {
              ...q,
              options: q.options.map((opt, i) => (i === index ? value : opt)),
            }
          : q
      ),
    }));
  };

  const handleRemoveOption = (id, index) => {
    setUserData((prevState) => ({
      ...prevState,
      questions: prevState.questions.map((q) =>
        q.id === id
          ? { ...q, options: q.options.filter((_, i) => i !== index) }
          : q
      ),
    }));
  };

  const handleRangeChange = (id, field, value) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === id ? { ...q, [field]: Number(value) } : q
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userData.firstname.trim() === "") {
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
      formMadeById: userId,
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

  return (
    <div className="w-full h-dvh">
      <Navbar />
      <div className="w-full h-svh flex justify-center items-center bg-slate-100">
        <div className="sm:w-2/6 my-5 text-xl flex flex-col border-none p-5 shadow-lg rounded-md backdrop-blur-sm bg-blue-200">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col m-2">
              <label className="font-extrabold drop-shadow-sm">
                Product Name:<span className="text-red-500 text-sm">*</span>
              </label>
              <input
                className="shadow-md py-1 px-2 m-2 rounded-md bg-blue-100 focus:outline-none focus:ring-[1.2px] ring-offset-0 ring-blue-500"
                name="firstname"
                type="text"
                value={userData.firstname}
                onChange={(e) =>
                  setUserData({ ...userData, firstname: e.target.value })
                }
              />
            </div>

            <p className="m-2 font-extrabold drop-shadow-sm flex items-center gap-5">
              Enter Your Questions{" "}
              <span className="cursor-pointer" onClick={handleQuestion}>
                <FaPlus />
              </span>
            </p>

            {userData.questions.map((q, i) => (
              <div
                className="flex flex-col m-2 p-4 border rounded-md shadow-md bg-white"
                key={q.id}
              >
                {/* Question Label */}
                <label className="font-extrabold drop-shadow-sm">
                  Q.{i + 1}
                </label>

                {/* Question Input */}
                <div className="flex items-center">
                  <input
                    className="w-full shadow-md py-1 px-2 m-2 rounded-md bg-blue-100 focus:outline-none focus:ring-[1.2px] ring-offset-0 ring-blue-500"
                    name="question"
                    type="text"
                    value={q.question}
                    onChange={(e) => handleData(e, q.id)}
                    required
                  />
                  <RxCross2
                    className="cursor-pointer text-red-500"
                    onClick={() => handleQuestionClear(q.id)}
                  />
                </div>

                {/* Type Selector */}
                <select
                  className="m-2 p-2 rounded-md shadow-md bg-white"
                  name="type"
                  value={q.type}
                  onChange={(e) => handleData(e, q.id)}
                >
                  <option value="text">Text</option>
                  <option value="checkbox">Checkbox</option>
                  <option value="radio">Radio</option>
                  <option value="range">Range</option>
                </select>

                {/* Answer Input (if type is Text) */}
                {q.type === "text" && (
                  <input
                    className="w-full shadow-md py-1 px-2 m-2 rounded-md bg-blue-100 focus:outline-none focus:ring-[1.2px] ring-offset-0 ring-blue-500"
                    type="text"
                    placeholder="User will enter text"
                    disabled
                  />
                )}

                {/* Options Section (for Checkbox & Radio) */}
                {(q.type === "checkbox" || q.type === "radio") && (
                  <div className="mt-2">
                    <p className="font-semibold">Options:</p>
                    {q.options.map((option, index) => (
                      <div key={index} className="flex items-center mt-1">
                        <input type={q.type} disabled className="mr-2" />
                        <input
                          className="w-full shadow-md py-1 px-2 rounded-md bg-blue-100 focus:outline-none focus:ring-[1.2px] ring-offset-0 ring-blue-500"
                          type="text"
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(q.id, index, e.target.value)
                          }
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(q.id, index)}
                          className="ml-2 text-red-500"
                        >
                          ❌
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddOption(q.id)}
                      className="mt-2 text-blue-500 text-sm"
                    >
                      + Add Option
                    </button>
                  </div>
                )}

                {/* Range Inputs (Min & Max) */}
                {q.type === "range" && (
                  <div className="mt-2">
                    <p className="font-semibold">Range:</p>
                    <div className="flex gap-2">
                      <input
                        className="w-1/2 shadow-md py-1 px-2 rounded-md bg-blue-100 focus:outline-none focus:ring-[1.2px] ring-offset-0 ring-blue-500"
                        type="number"
                        placeholder="Min"
                        value={q.options.min}
                        onChange={(e) =>
                          handleRangeChange(q.id, "min", e.target.value)
                        }
                      />
                      <input
                        className="w-1/2 shadow-md py-1 px-2 rounded-md bg-blue-100 focus:outline-none focus:ring-[1.2px] ring-offset-0 ring-blue-500"
                        type="number"
                        placeholder="Max"
                        value={q.options.max}
                        onChange={(e) =>
                          handleRangeChange(q.id, "max", e.target.value)
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="flex justify-center m-2">
              <button className="border border-blue-800 px-3 py-1.5 rounded-3xl text-white bg-blue-800 hover:bg-blue-100 hover:text-slate-900">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Form2 />
    </AuthProvider>
  );
}
