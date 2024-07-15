import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { AuthProvider } from "../contexts/getUser";
import { getDatabase, ref, update, get, child } from "firebase/database";
import app from "../Store/realtimeDB";

function Review() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [isShow, setIsShow] = useState(false);
  const [iframeUrl, setIframeUrl] = useState("");
  const [iframeVisible, setIframeVisible] = useState(false);
  const [ansForm, setAnsForm] = useState([]);
  const [dynamicKey, setDynamicKey] = useState("");

  // Populate the ansForm state with empty strings for each question
  const initializeAnswers = () => {
    const initialAnswers = [];
    state.data.questions.forEach((_, index) => {
      initialAnswers.push({id: "", answer: ""})
    });
    setAnsForm(initialAnswers);
  };

  console.log(ansForm);

  // Fetch the dynamic key when the component mounts
  useEffect(() => {
    const fetchDynamicKey = async () => {
      const db1 = getDatabase(app);
      const dbRef = ref(db1, `Database/${state.data._id}`);
      const snapshot = await get(dbRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        const keys = Object.keys(data);
        const firstKey = keys[0]; // Assuming you need the first key
        setDynamicKey(firstKey);
      } else {
        console.log("No data available");
      }
    };

    fetchDynamicKey();
    initializeAnswers();
  }, [state.data._id]);

  const ansInput = (e) => {
    const { name, value } = e.target;
    setAnsForm({ ...ansForm, [name]: value });
  };

  const saveAnswer = async () => {
    if (!dynamicKey) {
      alert("Dynamic key not found!");
      return;
    }

    const db1 = getDatabase(app);
    const userDocRef = ref(db1, `Database/${state.data._id}/${dynamicKey}`);

    // Fetch the current data dynamically
    const snapshot = await get(userDocRef);
    const currentData = snapshot.val();

    if (!currentData) {
      alert("No data found!");
      return;
    }

    const questions = currentData.questions;

    // Prepare updates for each answer
    state.data.questions.forEach((question, index) => {
      const answerKey = index;
      if (!questions[index][answerKey]) {
        questions[index][answerKey] = [];
      }
      questions[index][answerKey].push(ansForm[index]);
    });

    // Update the database with the answers
    await update(userDocRef, { questions })
      .then(() => {
        alert("Answers saved successfully!");
      })
      .catch((error) => {
        console.error("Error saving answers: ", error);
        alert("Error saving answers");
      });
  };

  const getData = () => {
    navigate("/getData");
  };

  const toggleIframe = (url) => {
    setIframeUrl(url);
    setIframeVisible(!iframeVisible);
  };

  const getQuestionsDiv = (questions) => {
    return `<div style=${style}>
        ${Object.entries(questions)
        .map(
          ([questionKey, questionValue]) => `
          <p class="text-xl p-1 font-bold">${questionKey}: ${questionValue}</p>
        `
        )
        .join("")}
      </div>`;
  };

  console.log(state);

  return (
    <>
      <p>This is Review</p>
      <button onClick={getData}>getData</button>
      <div>
        <div className="flex w-full h-52 flex-col border-2 shadow-xl items-center p-4 ">
          {state.data.questions.map((item, index) => (
            <p key={index} className="text-xl p-1 font-bold">
              {item.question}{" "}
              <input
                type="text"
                className="border-2"
                onChange={ansInput}
                name="answer"
                value={ansForm[index]}
              />
            </p>
          ))}
          <button onClick={saveAnswer}>Answer</button>
          <div className="flex justify-around items-center p-5">
            <button
              className="flex border-2 rounded-full bg-green-600 w-max h-max p-2 justify-center items-center text-white"
              onClick={() => setIsShow(!isShow)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                />
              </svg>
            </button>
          </div>
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: isShow ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="w-full border-2 min-h-16 border-slate-400 flex justify-around flex-col items-center origin-top"
          >
            <p
              className="w-full hover:bg-slate-700 hover:text-white hover:cursor-pointer text-center"
              onClick={() => toggleIframe("https://example.com")}
            >
              Get the link
            </p>
            <p
              className="w-full hover:bg-slate-700 hover:text-white hover:cursor-pointer text-center"
              onClick={() =>
                toggleIframe(getQuestionsDiv(state.data.questions))
              }
            >
              Embed Code
            </p>
          </motion.div>
        </div>
        {iframeVisible && (
          <iframe
            srcDoc={iframeUrl}
            className="w-full h-96 border-4 flex justify-center items-center"
          ></iframe>
        )}
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Review />
    </AuthProvider>
  );
}

