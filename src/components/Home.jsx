import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GetData from "./GetData";
import { AuthProvider, useAuth } from "../contexts/getUser";
import Navbar from "./Navbar";

function Home() {
  const navigate = useNavigate();
  const userData = useAuth().userData;

  const handleCreate = () => {
    navigate("/form");
  };

  console.log("home");

  return (
    <>
      <div className="w-full h-dvh">
        <Navbar />

        <div className="w-full bg-slate-100 px-24 py-6">
          <div className=" flex flex-row justify-between items-center my-24">
            <div className=" w-7/12 my-2 mr-2 py-1 flex flex-col">
              <div className="py-2">
                <p className="text-5xl font-extrabold drop-shadow-md">
                  Don't Know How To Create Space ?
                </p>
              </div>
              <div className="py-6">
                <p className="text-xl text-slate-600 drop-shadow-md">
                  Here is Quick Tutorial which will guide you to the working of
                  our Service 😄
                </p>
              </div>
            </div>
            <div className=" w-5/12 ml-2 flex justify-center items-center">
              <div className="w-full pt-[56.25%] m-2 relative flex justify-center items-center rounded-lg">
                <div className="absolute top-0 bottom-0 right-0 left-0 flex justify-center items-center">
                  <iframe
                    width="560"
                    height="315"
                    className=" rounded-lg shadow-sm"
                    src="https://www.youtube.com/embed/WNr31dmBciI?si=4Mv_uSdblbPLWEW0"
                    title="YouTube video player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerpolicy="strict-origin-when-cross-origin"
                    allowfullscreen
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
          <hr className="w-[95%] h-[2px] my-2 mx-auto bg-blue-800 shadow-sm" />
          <div className="flex flex-row justify-between items-center my-16">
            <p className="text-2xl font-bold">Spaces </p>
            <button
              onClick={handleCreate}
              className="px-3 py-1 text-md font-bold rounded-2xl border border-blue-400 bg-blue-400 text-white hover:bg-blue-100 hover:text-black"
            >
              Create Space +
            </button>
          </div>
          <div>
            <GetData />
          </div>
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Home />
    </AuthProvider>
  );
}
