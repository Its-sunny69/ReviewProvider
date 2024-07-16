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
    <div>
      <p className="text-2xl font-bold">Create Space: </p>
      <button
        onClick={handleCreate}
        className="border-2 w-32 h-12 text-xl font-semibold font-sans rounded-lg bg-blue-400 text-white"
      >
        Create +
      </button>
      <GetData />
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
