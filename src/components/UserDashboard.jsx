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
import IframeData from "../IframeData";
import Code from "./Code";

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

  console.log(window.location.origin);
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

  const content = "Byeee";

  const handleClick = (key, value) => {
    const content = `
      <div key=${key} style="background: green;">
        <p style=${styles.key}>${key}</p>
        ${value.map(
          (item) =>
            `<div key=${item.question}>
            <p style=${styles.answer}>
              ${item.question}: ${item.answer}
            </p>
          </div>
      `
        )}
      </div>
    `;
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

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <>
      <div className="w-full h-dvh">
        <Navbar />

        <div className="flex justify-center items-left flex-col border-2 shadow-sm">
          {state.data.item ? (
            Object.entries(state.data.item).map((key, index) => (
              <p className="font-bold text-xl" key={index}>
                {key[1].firstname}
              </p>
            ))
          ) : (
            <p className="font-bold text-xl">
              {state.data.firstname} Dashboard
            </p>
          )}
          <p>
            Form Link:{" "}
            <a
              href={`${window.location.origin}/review/${state.data._id}`}
              target="_blank"
            >
              {`${window.location.origin}/review/${state.data._id}`}
            </a>
          </p>
        </div>
        <button onClick={handleDelete}>Delete Space</button>
        <br />
        <button onClick={handleSubmit}>Review</button>
        <div className="flex flex-wrap justify-evenly items-center p-4">
          {Object.entries(names).map(([key, value], index) => (
            <div
              key={index}
              className="w-max h-max p-10 shadow-md border-2 border-slate-800 "
              ref={divRef}
            >
              <p>{key}</p>
              {value.map((item) => (
                <div key={item.question}>
                  <p>
                    {item.question}:{item.answer}
                  </p>
                </div>
              ))}
              <button onClick={() => openModal(key, value)}>share</button>
            </div>
          ))}
        </div>
        {/* {iframeContent ? <IframeData content={iframeContent} /> : null} */}

          <Modal isOpen={modalOpen} isClosed={closeModal}>
            <p className="text-2xl font-bold my-4">Code For Your Testimonial</p>
            {/* <div
              className="my-3"
            >
              <p className="my-1 text-lg">Embed Code:</p>
              <pre className="overflow-scroll my-1" contentEditable>
                <code className="">
                &lt;iframe src=&quot;${iframeSrc}&quot; width=&quot;100%&quot;
                height=&quot;400&quot; style=&quot;border:none;&quot;
                title=&quot;Dynamic Content&quot;&gt;&lt;/iframe&gt;
                </code>
              </pre> 
            </div> */}
            <Code code={`<iframe src=${iframeSrc} width="100%" height="400" style="border:none;" title="Dynamic Content"></iframe>`} language="javascript" copy={true}/>
          </Modal>  
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


