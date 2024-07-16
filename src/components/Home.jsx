import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GetData from "./GetData";
import { AuthProvider, useAuth } from "../contexts/getUser";

function Home() {
  const navigate = useNavigate();
  const userData = useAuth().userData;

  const handleCreate = () => {
    navigate("/form");
  };

  console.log('home')


  return (
    <div className="w-full h-dvh px-4 py-2 pt-16">
      <div className="border border-black grid grid-cols-2 gap-4">
        <div className="m-2 p-1 flex flex-col">
          <div className="p-2">
            <p className="text-5xl font-extrabold drop-shadow-md">Don't Now How To Create Space ?</p>
          </div>
          <div className="p-2 py-6">
            <p className="text-xl text-slate-600 drop-shadow-md">Here is Quick Tutorail which will guide you to the working of our Service 😄</p>
          </div>
          <div className="p-2">
            <button className="border border-1 shadow-md border-blue-800 h-max px-3 py-1.5 rounded-3xl text-white font-mono font-bold text-md bg-blue-800 hover:bg-blue-100 hover:text-slate-900">
              Learn More
            </button>
          </div>
        </div>
        <div className="bg-blue-400">
          <div className="w-4/5 h-10 bg-gray-600">

          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between items-center">
        <p className="text-2xl font-bold my-3">Spaces </p>
        <button
          onClick={handleCreate}
          className="px-3 py-1 text-md font-bold rounded-2xl border border-blue-400 bg-blue-400 text-white hover:bg-blue-100 hover:text-black"
        >
          Create Space +
        </button>
      </div>
      <hr className="w-[95%] h-[2px] m-2 mx-auto bg-blue-800 shadow-sm" />
      <div>
        <GetData />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Home />
    </AuthProvider>
  );
}
