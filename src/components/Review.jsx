import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect, useId } from "react";
import { AuthProvider, useAuth } from "../contexts/getUser";
import { fetchReviewCategory, updateSentimentCount } from "../utils/helper";
import { getDatabase, ref, update, get } from "firebase/database";
import app, { auth } from "../Store/realtimeDB";
import Navbar from "./Navbar";
import toast from "react-hot-toast";
import LoadingPage from "./LoadingPage";
import { CopyTwoTone, ShareAltOutlined } from "@ant-design/icons";
import reviewImg from "../assets/review.jpg";

function Review() {
  const { state } = useLocation();
  const { id, loading } = useAuth();
  const [formMadeById, setFormMadeById] = useState();
  const [isShow, setIsShow] = useState(false);
  const [ansForm, setAnsForm] = useState([]);
  const [inputName, setInputName] = useState("");
  const [dynamicKey, setDynamicKey] = useState("");
  const [data, setData] = useState(state ? state.data : []);
  const [questions, setQuestions] = useState(
    state ? state.data.questions : data ? data.questions : []
  );
  const { reviewId } = useParams();
  const navigate = useNavigate();

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

        setData((prev) => [...prev, updatedData]);
        setFormMadeById(updatedData[0].formMadeById);
        setQuestions(updatedData[0].questions);
      } else {
        console.log("Fetch failed");
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
      setInputName(change);
      ansForm[i].id = change;
    }
  };

  const answerConvert = async (ansForm) => {
    const reviews = ansForm.map(
      (ans, index) => `${questions[index]?.question}: ${ans.answer}`
    );
    console.log(reviews);
    const data = await fetchReviewCategory(reviews);

    if (data) {
      updateSentimentCount(data, formMadeById);
    } else {
      toast.error("Failed to fetch review category", {
        position: "top-center",
        duration: 2000,
      });
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

    answerConvert(ansForm);

    // Update the database with the answers
    await update(userDocRef, { questions })
      .then(() => {
        toast.success("Answers saved successfully!", {
          position: "top-center",
          duration: 2000,
        });
        setData((prevData) => ({
          ...prevData,
          questions: [...questions], // Deep clone the questions array
        }));
        setQuestions([...questions]);
      })
      .catch((error) => {
        console.error("Error saving answers: ", error);
        toast.error("Error saving answers", {
          position: "top-center",
          duration: 2000,
        });
      });
  };

  const handleLink = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/review/${data._id}`
      );
      toast.success("Link Copied!", {
        duration: 1000,
        position: "top-center",
      });
    } catch (error) {
      console.error("Failed to copy: ", error);
      toast.error("Failed to copy link!", {
        duration: 1000,
        position: "top-center",
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = questions.every(
      (item, index) => ansForm[index].answer.trim() !== ""
    );
    const isNameValid = inputName.trim() !== "";

    if (isValid && isNameValid) {
      saveAnswer();
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (ansForm.length && questions.length && data)
    return (
      <>
        <div className="w-full h-dvh">
          {auth.currentUser.isAnonymous ? "" : <Navbar />}

          <div className=" flex justify-center items-center ">
            <div className="sm:w-2/6 my-5 text-xl flex flex-col border-none p-5 shadow-lg rounded-md backdrop-blur-sm bg-blue-200">
              <form onSubmit={handleSubmit}>
                <div className="flex justify-center items-center">
                  <p className="text-2xl font-extrabold drop-shadow-sm">
                    Review Form
                  </p>
                </div>

                <div className="flex flex-col m-2">
                  <label className=" font-bold drop-shadow-sm">Name:</label>
                  <input
                    className=" shadow-md py-1 px-2 m-2 rounded-md bg-blue-100 focus:outline-none focus:ring-[1.2px] ring-offset-red-300 ring-offset-0 ring-blue-500"
                    type="text"
                    name="id"
                    value={inputName}
                    onChange={(e) => updateId(e)}
                    maxLength={10}
                    required
                  />
                </div>

                {questions.map((item, index) => (
                  <div className="flex flex-col m-2" key={index}>
                    <label className="font-bold drop-shadow-sm">
                      Q.{index + 1} {item.question}
                    </label>

                    {item.type === "text" && (
                      <input
                        type="text"
                        className="shadow-md py-1 px-2 m-2 rounded-md bg-blue-100 focus:outline-none focus:ring-[1.2px] ring-offset-red-300 ring-offset-0 ring-blue-500"
                        onChange={(e) => ansInput(e, index)}
                        name={`answer`}
                        value={ansForm[index]?.answer || ""}
                        required
                      />
                    )}

                    {item.type === "checkbox" &&
                      item.options?.map((option, optIndex) => (
                        <label
                          key={optIndex}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            value={option}
                            name={`question-${index}`}
                            onChange={(e) => ansInput(e, index, optIndex)}
                            checked={ansForm[index]?.answer?.includes(option)}
                          />
                          <span>{option}</span>
                        </label>
                      ))}

                    {item.type === "radio" &&
                      item.options?.map((option, optIndex) => (
                        <label
                          key={optIndex}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="radio"
                            name={`question-${index}`}
                            value={option}
                            onChange={(e) => ansInput(e, index)}
                            checked={ansForm[index]?.answer === option}
                          />
                          <span>{option}</span>
                        </label>
                      ))}

                    {item.type === "range" && (
                      <div className="flex flex-col">
                        <input
                          type="range"
                          min={item.min || 0}
                          max={item.max || 10}
                          step={item.step || 1}
                          className="w-full accent-blue-500"
                          onChange={(e) => ansInput(e, index)}
                          name={`answer`}
                          value={ansForm[index]?.answer || item.min || 0}
                        />
                        <span className="text-center font-semibold mt-1">
                          {ansForm[index]?.answer || item.min || 0}
                        </span>
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex justify-center items-center">
                  <button
                    className="border border-1 shadow-md border-blue-800 h-max px-3 py-1.5 rounded-3xl text-white font-mono font-bold text-md bg-blue-800 hover:bg-blue-100 hover:text-slate-900"
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </form>
              {data && data._id ? (
                <>
                  <hr className="w-full h-[1.5px] mt-4 mb-4 bg-white" />
                  <div className="flex justify-end items-center">
                    <button
                      className="w-fit text-2xl font-extrabold text-blue-600 hover:text-blue-400 hover:scale-125 flex justify-start items-center transition ease-in-out delay-120"
                      onClick={() => setIsShow(!isShow)}
                    >
                      <ShareAltOutlined />
                    </button>
                  </div>
                </>
              ) : (
                ""
              )}
              {isShow ? (
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: isShow ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full flex justify-around flex-col items-center origin-top"
                >
                  <div className="w-full flex flex-col p-2">
                    <p className="font-extrabold drop-shadow-sm">Form Link:</p>
                    <div className="flex">
                      <input
                        className="w-full shadow-md py-1 px-2 m-2 mr-0 rounded-md rounded-r-none bg-blue-100 focus:outline-none focus:ring-[1.2px] ring-offset-red-300 ring-offset-0 ring-blue-500"
                        defaultValue={`${window.location.origin}/review/${data._id}`}
                        readOnly
                      />
                      <button
                        className="w-2/12 shadow-md py-1 px-2 m-2 ml-0 rounded-md rounded-l-none bg-blue-400 focus:outline-none focus:ring-[1.2px] ring-offset-red-300 ring-offset-0 ring-blue-500"
                        type="button"
                        onClick={handleLink}
                      >
                        <CopyTwoTone />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                ""
              )}
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
