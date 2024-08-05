import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getDatabase, ref, get, remove } from "firebase/database";
import app, { store } from "../Store/realtimeDB";
import { AuthProvider, useAuth } from "../contexts/getUser";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import Modal from "./Modal";
import { renderToString } from "react-dom/server";
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
import parse from "html-react-parser";

import {
  IframeContentProvider,
  useIframeContent,
} from "../contexts/IframeContentContext";

function UserDashboard() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useAuth();
  const [names, setNames] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState(null);
  const [dynamicKey, setDynamicKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [iframeSrc, setIframeSrc] = useState("");
  const { setIframeContent, iframeContent } = useIframeContent();
  const [contentDiv, setContentDiv] = useState("");

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

  // useEffect(() => {
  //   setIframeSrc(`${window.location.origin}/iframe-render`);
  // }, []);

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

  const handleClick = (key, value) => {
    // const content = `
    //   <div key=${key} style="background: green;">
    //     <p style=${styles.key}>${key}</p>
    //     ${value.map(
    //       (item) =>
    //         `<div key=${item.question}>
    //         <p style=${styles.answer}>
    //           ${item.question}: ${item.answer}
    //         </p>
    //       </div>
    //   `
    //     )}
    //   </div>
    // `;

    const content = `
        <style>

        .card-content::-webkit-scrollbar {
            width: 5px;
            height: 5px;
        }
        .card-content::-webkit-scrollbar-track {
            background-color: #f1f5f9;
            border-radius: 10px;
        }
        .card-content::-webkit-scrollbar-thumb {
            background-color: #60a5fa;
            border-radius: 10px;
        }

        .card {
          width: 18rem;
          height: 26rem;
          margin: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          background-color: #bfdbfe;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          font-family: "Inconsolata", monospace;
        }

        .card-header {
          display: flex;
          height: 6rem;
          padding: 20px 20px 0 20px;
          justify-content: flex-start;
          align-items: center;
        }

        .img svg {
        width: 4rem;
        height: 4rem;
        margin-right: 1rem
        }

        .card-header p {
          font-size: 1.875rem;
          font-weight: bold;
          color: #475569;
          word-break: break-word;
          text-transform: capitalize;
        }

        .card-content {
          margin: 12px 30px;
          height: 12.8rem;
          position: relative;
          overflow-y: auto;
          scroll-behavior: smooth;
        }

        .gradient-top {
          background: linear-gradient(to bottom, #bfdbfe 10%, rgba(191, 219, 254, 0) 100%);
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          height: 24px;
          z-index: 50;
        }

        .gradient-bottom {
          background: linear-gradient(to top, #bfdbfe 10%, rgba(191, 219, 254, 0) 100%);
          position: sticky;
          bottom: 0;
          left: 0;
          right: 0;
          height: 24px;
          z-index: 50;
        }

        .card-content p {
          word-break: break-word;
          text-transform: capitalize;
        }

        .question {
          font-weight: bold;
          font-size: 1.125rem;
        }

        .separator {
          width: 100%;
          height: 1.25px;
          margin: 16px 0;
          background-color: white;
          border: none;
        }

        .card-footer {
  
          display: flex;
          justify-content: flex-end;
          padding: 20px;
          padding-top: 0;
        }

        .logo-button a {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 1rem;
          font-weight: 800;
          color: #2563eb;
          cursor: pointer;
          transition: transform 0.12s ease-in-out, color 0.12s ease-in-out;
          text-decoration: none;
        }

        .logo-button a img {
          width: 2.5rem;
          margin-right: 5px;
        }

        .logo-button:hover a {
          opacity: 40%;
        }
      </style>
        <div class="card">
          <div class="card-header">
            <p class="img">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M13 14.725c0-5.141 3.892-10.519 10-11.725l.984 2.126c-2.215.835-4.163 3.742-4.38 5.746 2.491.392 4.396 2.547 4.396 5.149 0 3.182-2.584 4.979-5.199 4.979-3.015 0-5.801-2.305-5.801-6.275zm-13 0c0-5.141 3.892-10.519 10-11.725l.984 2.126c-2.215.835-4.163 3.742-4.38 5.746 2.491.392 4.396 2.547 4.396 5.149 0 3.182-2.584 4.979-5.199 4.979-3.015 0-5.801-2.305-5.801-6.275z"/></svg>
            </p>
            <p>${key}</p>
          </div>

          <div class="card-content">
            <div class="gradient-top"></div>
            <div>
              ${value
                .map(
                  (item, i) => `
                <div key=${item.question}>
                  <p class="question">Q.${i + 1} ${item.question}</p>
                  <p>&emsp;&emsp;&emsp;${item.answer}</p>
                </div>
                `
                )
                .join("")}
            </div>
            <div class="gradient-bottom"></div>
          </div>
          <hr class="separator" />
          <div class="card-footer">
            <div class="logo-button">
            <a href="https://review-provider.vercel.app/" target="_blank">
             <img src="https://raw.githubusercontent.com/Its-sunny69/ReviewProvider/main/src/assets/logo.svg" alt="logo" />

             TrustVibes
             <a>
            </div>
          </div>
        </div>
    `;
    setContentDiv(content);
    const uri = `data:text/html;charset=utf-8,${encodeURIComponent(content)}`;
    setIframeSrc(uri);
    setIframeContent(content);
  };

  const openModal = (key, value) => {
    handleClick(key, value);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  function capitalizeFirstLetter(str) {
    if (typeof str !== "string") return "str is not a string"; // Ensure str is a string
    if (!str.length) return str; // Handle empty strings
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }


  if (loading) {
    return <LoadingPage />;
  }

  return (
    <>
      <div className="w-full h-dvh">
        <Navbar />

        <div className="sm:px-24 px-10 py-6 bg-slate-100">
          <div className="flex mt-2 mb-2 p-4 justify-center items-center flex-col bg-blue-200 shadow-sm rounded-lg">
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

          <div className="flex my-6 flex-wrap justify-evenly items-center">
            {Object.entries(names).map(([key, value], index) => (
              <div
                key={index}
                className="sm:w-[30%] m-2 shadow-sm bg-blue-200 rounded-lg"
                ref={divRef}
              >
                <div className="flex sm:h-[6rem] h-[4rem] p-10 pb-0 justify-start items-center">
                  <img className="mr-4 w-14" src={Quote} alt="quote" />
                  <p className="text-3xl font-bold text-slate-500 break-words">
                    {capitalizeFirstLetter(key)}
                  </p>
                </div>

                <div className="my-3 px-10 sm:h-[14rem] h-[2rem]] relative overflow-y-auto scroll-smooth">
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
                    onClick={() => openModal(key, value)}
                  >
                    <ShareAltOutlined />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Modal isOpen={modalOpen} isClosed={closeModal}>
            <p className="text-2xl font-bold my-4 sm:text-left text-center">Code For Your Testimonial</p>

            <div className="w-full sm:grid sm:grid-cols-6">
              <div className="flex justify-center items-center sm:col-span-4">
                <Code
                  code={`<iframe src=${iframeSrc} width="100%" height="400" style="border:none;" title="Dynamic Content"></iframe>`}
                  language="javascript"
                  copy={true}
                />
              </div>
              <div className="flex justify-center items-center col-span-2">
                {parse(contentDiv)}
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <IframeContentProvider>
        <UserDashboard />
      </IframeContentProvider>
    </AuthProvider>
  );
}
