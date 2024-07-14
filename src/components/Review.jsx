import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { getDatabase, ref, get, push } from "firebase/database";
import { AuthProvider, useAuth } from "../contexts/getUser";
import app from "../Store/realtimeDB";
import { arrayUnion, doc, getFirestore, updateDoc } from "firebase/firestore";

function Review() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [isShow, setIsShow] = useState(false);
  const [iframeUrl, setIframeUrl] = useState("");
  const [iframeVisible, setIframeVisible] = useState(false);
  const [ansForm, setAnsForm] = useState({
    answer0: "",
    answer1: "",
    answer2: "",
  });
  console.log(state)
  const ansInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setAnsForm({ ...ansForm, [name]: value });
  };

  const style = {
    display: "flex",
    flexDirection: "column",
    width: "13rem",
    height: "13rem",
    border: "2px solid",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    alignItems: "center",
    padding: "1rem",
  };

  const saveAnswer = async () => {
    const db = getFirestore(app);
    Object.values(ansForm).forEach(async (item, index) => {
      const newDocRef = doc(db, `Database/${state.data._id}/${index}`);
      await updateDoc(newDocRef, {
        answer: arrayUnion(`${item}.answer${index}`),
      });
      console.log(newDocRef);
    })
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
                name={`answer${index}`}
                value={ansForm[`answer${index}`]}
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
                toggleIframe(getQuestionsDiv(value.reviewQ.questions))
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
      <Review></Review>
    </AuthProvider>
  );
}
