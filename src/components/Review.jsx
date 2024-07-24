import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "../contexts/getUser";
import { getDatabase, ref, update, get } from "firebase/database";
import app from "../Store/realtimeDB";
import Navbar from "./Navbar";
import toast from "react-hot-toast";
import LoadingPage from "./LoadingPage"

function Review() {
  const { state } = useLocation();
  const { id, loading } = useAuth();
  const [isShow, setIsShow] = useState(false);
  const [ansForm, setAnsForm] = useState([]);
  const [inputName, setInputName] = useState("");
  const [dynamicKey, setDynamicKey] = useState("");
  const [data, setData] = useState(state ? state.data : []);
  const [questions, setQuestions] = useState(
    state ? state.data.questions : data ? data.questions : []
  );
  const { reviewId } = useParams();

  useEffect(() => {
    const getData = async (path) => {
      const db = getDatabase(app);
      const dbRef = ref(db, `Database/${path}`);
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const fetchedData = Object.values(snapshot.val());
        const updatedData = fetchedData.map((item) => ({
          ...item,
          _id: path,
        }));
        console.log(updatedData);
        setData((prev) => [...prev, updatedData]);
        setQuestions(updatedData[0].questions);
      } else {
        console.log("Fetch failed");
        setLoading(false);
      }
    };

    if (reviewId) {
      getData(reviewId);
    }
  }, [reviewId]);

  // Populate the ansForm state with empty strings for each question
  const initializeAnswers = () => {
    const initialAnswers = [];
    questions?.forEach((_, index) => {
      initialAnswers.push({ id: inputName, answer: "" });
    });
    setAnsForm(initialAnswers);
  };

  // Fetch the dynamic key when the component mounts
  useEffect(() => {
    const fetchDynamicKey = async () => {
      const db1 = getDatabase(app);
      const dbRef = ref(db1, `Database/${state ? state.data._id : reviewId}`);
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
    setTimeout(() => {
      fetchDynamicKey();
      initializeAnswers();
    }, 10);
  }, [state || data]);

  const ansInput = (e, index) => {
    const { name, value } = e.target;
    setAnsForm((prev) => {
      // Create a shallow copy of the previous state
      const newState = [...prev];
      // Update the specific element at the given index
      newState[index] = {
        ...newState[index],
        answer: value,
      };
      return newState;
    });
  };

  const updateId = (e) => {
    let change = e.target.value;
    for (let i = 0; i < ansForm.length; i++) {
      setInputName(change)
      ansForm[i].id = change;
    }
  };

  const saveAnswer = async () => {
    if (!dynamicKey) {
      alert("Dynamic key not found!");
      return;
    }

    const db1 = getDatabase(app);
    const userDocRef = ref(
      db1,
      `Database/${state ? state.data._id : reviewId}/${dynamicKey}`
    );

    // Fetch the current data dynamically
    const snapshot = await get(userDocRef);
    const currentData = snapshot.val();

    if (!currentData) {
      alert("No data found!");
      return;
    }

    const questions = currentData.questions;

    // Prepare updates for each answer
    questions.forEach((question, index) => {
      if (!questions[index]["answers"]) {
        questions[index]["answers"] = [];
      }
      questions[index]["answers"].push(ansForm[index]);
    });

    // Update the database with the answers
    await update(userDocRef, { questions })
      .then(() => {
        alert("Answers saved successfully!");
        setData((prevData) => ({
          ...prevData,
          questions: [...questions], // Deep clone the questions array
        }));
        setQuestions([...questions]);
      })
      .catch((error) => {
        console.error("Error saving answers: ", error);
        alert("Error saving answers");
      });
  };

  const handleLink = () => {
    navigator.clipboard.writeText(
      `${import.meta.env.VITE_API_URL}/review/${data._id}`
    );
    toast.success("Link Copied!", {
      duration: 1000,
      position: "top-center",
    });
  };

  if (loading) {
    return <LoadingPage/>
  }

  if (ansForm.length && questions.length && data)
    return (
      <>
        <div className="w-full h-dvh">
          <Navbar />

          <p>This is Review</p>
          <div>
            <div className="flex w-full h-52 flex-col border-2 shadow-xl items-center p-4 ">
              {questions.map((item, index) => (
                <>
                  <p key={index} className="text-xl p-1 font-bold">
                    {item.question}{" "}
                    <input
                      type="text"
                      className="border-2"
                      onChange={(e) => ansInput(e, index)}
                      name={`answer`}
                      value={ansForm[index].answer}
                    />
                  </p>
                </>
              ))}
              <>
                <p>Name:</p>
                <input
                  type="text"
                  name="id"
                  value={inputName}
                  onChange={(e) => updateId(e)}
                />
              </>

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
                <p>{`${import.meta.env.VITE_API_URL}/review/${data._id}`}</p>
                <p
                  className="w-full hover:bg-slate-700 hover:text-white hover:cursor-pointer text-center"
                  onClick={handleLink}
                >
                  Copy the link
                </p>
              </motion.div>
            </div>
          </div>
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
