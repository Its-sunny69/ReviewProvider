import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getDatabase, ref, get, remove } from "firebase/database";
import app, { store } from "../Store/realtimeDB";
import { AuthProvider, useAuth } from "../contexts/getUser";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import Modal from "./Modal";
import Navbar from "./Navbar";
import LoadingPage from "./LoadingPage";
import Code from "./Code";
import {
  DeleteOutlined,
  DeleteFilled,
  ShareAltOutlined,
} from "@ant-design/icons";
import toast from "react-hot-toast";
import Quote from "../assets/quote.svg";
import { capitalizeFirstLetter } from "../utils/helper";

function UserDashboard() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useAuth();
  const [names, setNames] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cardIndex, setCardIndex] = useState(null);
  // const [iframeContent, setIframeContent] = useState(null);

  const divRef = useRef(null);

  const styles = {
    container: {
      width: "max-content",
      height: "max-content",
      padding: "40px",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      border: "2px solid #1e293b",
      cursor: "pointer",
      backgroundColor: "#fff",
    },
    key: {
      fontWeight: "bold",
      fontSize: "1rem",
    },
    answer: {
      fontSize: "0.875rem",
    },
    button: {
      backgroundColor: "#fff",
      border: "1px solid #1e293b",
      padding: "0.5rem 1rem",
      borderRadius: "0.25rem",
      fontSize: "0.875rem",
      cursor: "pointer",
    },
  };

  //console.log(window.location.origin);
  const fetchData = async (path) => {
    const db = getDatabase(app);
    const dbRef = ref(db, `Database/${path}`);
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      const fetchedData = snapshot.val();
      const key = Object.keys(fetchedData);
      const firstKey = key[0];
      setData(fetchedData[`${firstKey}`]);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } else {
      console.log("No data available");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (state && state.data) {
      fetchData(state.data._id);
    }
  }, [state]);

  useEffect(() => {
    if (data && data.questions) {
      const updateNames = (questions) => {
        const names = {};
        questions.forEach((item) => {
          if (item.answers) {
            item.answers.forEach((answer) => {
              if (!names[answer.id]) names[answer.id] = [];
              names[answer.id].push({
                question: item.question,
                answer: answer.answer,
              });
            });
          }
        });
        setNames(names);
      };

      setTimeout(() => {
        updateNames(data.questions);
      }, 1000);
    }
  }, [data]);

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
        toast("Spaces Deleted", {
          icon: (
            <span className="text-red-500">
              <DeleteFilled />
            </span>
          ),
          position: "top-center",
          duration: 2000,
        });
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

  const openModal = (index) => {
    setModalOpen(true);
    setCardIndex(index);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  if (loading) {
    return <LoadingPage />;
  }

  console.log(names);

  return (
    <div className="h-[60rem]">
      <Navbar />

      <div className="sm:px-24 px-10 ">
        <div className=" flex my-2 p-4 justify-center items-center flex-col bg-blue-200 shadow-sm rounded-lg">
          <div className="w-full sm:mb-2 p-2 flex justify-between items-center flex-row">
            <div className="w-[90%] my-2 flex justify-center flex-col">
              {state.data.item ? (
                Object.entries(state.data.item).map((key, index) => (
                  <p className="font-bold text-xl my-2" key={index}>
                    {key[1].firstname}
                  </p>
                ))
              ) : (
                <p className="font-bold text-xl my-2">
                  {capitalizeFirstLetter(state.data.firstname)} Dashboard
                </p>
              )}
              <p className="font-bold">
                Form Link:{" "}
                <a
                  href={`${window.location.origin}/review/${state.data._id}`}
                  target="_blank"
                  className="font-normal underline hover:text-blue-500 visited:text-blue-800"
                >
                  Open Link
                </a>
              </p>
              <p className="font-bold">
                {" "}
                Insights:{" "}
                <a
                  href={`${window.location.origin}/graph`}
                  target="_blank"
                  className="font-normal underline hover:text-blue-500 visited:text-blue-800"
                >
                  Open Graph
                </a>
              </p>
            </div>
            <div className="flex justify-center items-center my-4">
              <button
                className="flex items-center gap-x-2 border border-1 shadow-md border-red-500 h-max sm:px-3 px-5 sm:py-1.5 py-2 rounded-3xl text-white font-mono font-bold sm:text-md text-lg bg-red-500 hover:bg-red-100 hover:text-slate-900"
                onClick={handleDelete}
              >
                <DeleteOutlined />
              </button>
            </div>
          </div>
          <hr className="w-full h-[1px] mt-4 mb-4 bg-white" />
          <div className="flex justify-center items-center">
            <button
              className="flex items-center justify-center border border-1 shadow-md px-3 py-1.5 rounded-3xl text-white font-mono font-bold text-md  border-blue-800 p-3 text-md bg-blue-600 hover:bg-blue-100 hover:text-black hover:opacity-65 hover:shadow-none"
              onClick={handleSubmit}
            >
              View Form
            </button>
          </div>
        </div>

        <div className="flex flex-wrap w-full justify-start">
          {Object.entries(names).map(([key, value], index) => (
            <div
              key={index}
              className="sm:w-[30%] m-2 shadow-sm bg-blue-200 rounded-lg h-full"
              ref={divRef}
            >
              <div className="flex sm:h-[6rem] h-[3rem] p-10 pb-0 justify-start items-center">
                <img className="mr-4 w-14" src={Quote} alt="quote" />
                <p className="text-3xl font-bold text-slate-500 break-words">
                  {capitalizeFirstLetter(key)}
                </p>
              </div>

              <div className="my-3 px-10 sm:h-[14rem] h-[2rem] relative overflow-y-auto scroll-smooth">
                <div className="bg-gradient-to-b from-blue-200 from-10% sticky top-0 left-0 right-0 h-6 z-50"></div>
                {value.map((item, i) => (
                  <div key={item.question}>
                    <p className="font-bold text-lg break-words">
                      Q.{i + 1} {item.question}
                    </p>
                    <p className="break-words">
                      &emsp;&emsp;&emsp;{item.answer}
                    </p>
                  </div>
                ))}
                <div className="bg-gradient-to-t from-blue-200 from-10% sticky -bottom-0 left-0 right-0 h-6 z-50"></div>
              </div>

              <hr className="w-full h-[1.5px] mt-4 mb-4 bg-white" />
              <div className="w-full flex justify-end sm:p-[2rem] p-5 pt-0">
                <button
                  className="w-fit text-2xl font-extrabold text-blue-600 hover:text-blue-400 hover:scale-125 flex justify-start items-center transition ease-in-out delay-120"
                  onClick={() => openModal(index)}
                >
                  <ShareAltOutlined />
                </button>
              </div>
            </div>
          ))}
        </div>

        <Modal isOpen={modalOpen} isClosed={closeModal}>
          <p className="text-2xl font-bold my-4 sm:text-left text-center">
            Code For Your Testimonial
          </p>

          <div className="w-full sm:grid sm:grid-cols-6">
            <div className="flex justify-center items-center sm:col-span-4">
              <Code
                code={`<iframe src=${window.location.origin}/iframe/${state.data._id}/${cardIndex} width="800" height="800" style="border:none;" title="Dynamic Content"></iframe>`}
                language="javascript"
                copy={true}
              />
            </div>
            <div className="flex justify-center items-center col-span-2">
              {
                <iframe
                  height={500}
                  width={200}
                  src={`${window.location.origin}/iframe/${state.data._id}/${cardIndex} `}
                  frameborder="0"
                ></iframe>
              }
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <UserDashboard />
    </AuthProvider>
  );
}
