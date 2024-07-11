import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, set, push } from "firebase/database";
import app from "./Store/realtimeDB";

function Form2() {
  const [userData, setUserData] = useState({
    firstname: "",
    questions: {},
  });

  const questionArray = [1, 2, 3];
  useEffect(() => {
    const initialQuestions = {};
    questionArray.forEach((_, index) => {
      initialQuestions[`question${index + 1}`] = "";
    });
    setUserData((prevState) => ({
      ...prevState,
      questions: initialQuestions,
    }));
  }, []);

  const navigate = useNavigate();

  const saveData = async () => {
    let id = uuidv4();
    console.log(id);
    const db = getDatabase(app);
    const newDocRef = push(ref(db, `Database/${id}`));
    set(newDocRef, {
      firstname: userData.firstname,
      formLink: "",
      reviewQ: {
        questions: userData.questions,
      },
    })
      .then(() => {
        alert("Data Saved");
      })
      .catch((error) => {
        alert("error", error.message);
      });

    navigate("/user-dashboard");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  let name, value;
  const handleData = (e) => {
    name = e.target.name;
    value = e.target.value;

    if (name.startsWith("question")) {
      setUserData((prevState) => ({
        ...prevState,
        questions: {
          ...prevState.questions,
          [name]: value,
        },
      }));
    } else {
      setUserData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  console.log(userData);

  return (
    <>
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
    </>
  );
}

export default Form2;
