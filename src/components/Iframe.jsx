import React from "react";
import { DataProvider, useData } from "../contexts/getDataContext.jsx";
import { AuthProvider } from "../contexts/getUser.jsx";
import { useParams } from "react-router-dom";
import { getDatabase, ref, get, remove } from "firebase/database";
import app, { store } from "../Store/realtimeDB";
import LoadingPage from "./LoadingPage.jsx";
import { useState, useEffect } from "react";
import { capitalizeFirstLetter } from "../utils/helper.js";
import Quote from "../assets/quote.svg";

export default function Iframe() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [names, setNames] = useState({});
  const { id, cardindex } = useParams();
  console.log(cardindex);

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
    if (id) {
      fetchData(id);
    }
  }, [id]);

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
  if (loading) {
    <LoadingPage />;
  }

  console.log(data);
  console.log(names);
  return (
    <>
      <div className="flex my-6 flex-wrap justify-evenly items-center">
        {Object.entries(names).map(([key, value], index) =>
          index == cardindex ? (
            <div
              key={index}
              className="sm:w-[50%] m-2 shadow-sm bg-blue-200 rounded-lg"
            >
              <div className="flex sm:h-[6rem] h-[4rem] w-full p-10 pb-0 justify-start items-center">
                <img className="mr-4 w-14" src={Quote} alt="quote" />
                <p className="text-3xl font-bold text-slate-500 break-words">
                  {" "}
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
                <a
                  className="flex justify-end items-center"
                  href="https://review-provider.vercel.app/"
                  target="_blank"
                >
                  <img
                    height={40}
                    width={40}
                    src="https://raw.githubusercontent.com/Its-sunny69/ReviewProvider/main/src/assets/logo.svg"
                    alt="logo"
                  />
                  <p className="text-blue-800 font-bold">TrustVibes</p>
                </a>
              </div>
            </div>
          ) : (
            ""
          )
        )}
      </div>
    </>
  );
}
