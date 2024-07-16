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

  return (
    <div className="mx-4 my-2">
      <div className="flex flex-row justify-between items-center">
        <p className="text-2xl font-bold my-3">Spaces </p>
        <button
          onClick={handleCreate}
          className="px-3 py-1 text-md font-bold rounded-2xl border border-blue-400 bg-blue-400 text-white hover:bg-blue-200 hover:text-black"
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
