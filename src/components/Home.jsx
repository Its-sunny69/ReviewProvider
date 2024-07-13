import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GetData from "./GetData";
import { AuthProvider, useAuth } from "../contexts/getUser";
import { auth } from "../Store/realtimeDB";
import toast from "react-hot-toast";

function Home() {
  const navigate = useNavigate();
  const userData = useAuth().userData;

  const handleCreate = () => {
    navigate("/Form");
  };

  const handleLogout = async() => {
    try {
      await auth.signOut();
      toast.success("User Logedout Successfully!!", {
        duration: 2000,
        position: "top-center"
      })
      navigate("/Login")
    } catch (error) {
      toast.error(error.message, {
        duration: 2000,
        position: "bottom-center"
      }) 
    }
  }
  return (
    <div>
      {userData ? (
        <p>
          UserName: {userData.fname} {userData.lname}
        </p>
      ) : (
        console.log("UserData Loading...")
      )}

      <button onClick={handleLogout}>Logout</button>
      <p className="text-2xl font-bold">Create Space: </p>
      <button
        onClick={handleCreate}
        className="border-2 w-32 h-12 text-xl font-semibold font-sans rounded-lg bg-blue-400 text-white"
      >
        {" "}
        Create +{" "}
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
