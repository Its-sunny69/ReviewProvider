import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../Store/realtimeDB";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  let name, value;
  const handleInput = (e) => {
    name = e.target.name;
    value = e.target.value;

    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, userData.email, userData.password);
      toast.success("User Logedin Successfully", {
        duration: 4000,
        position: "top-center",
      });
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.message, {
        duration: 4000,
        position: "bottom-center",
      });
    }
  };

  console.log(userData);

  return (
    <>
      <form className="w-3/5 flex flex-col" action="" onSubmit={handleSubmit}>
        <label htmlFor="email">Email: </label>
        <input
          className=" border border-black"
          type="email"
          name="email"
          value={userData.email}
          onChange={handleInput}
        />
        <label htmlFor="password">Password: </label>
        <input
          className=" border border-black"
          type="password"
          name="password"
          value={userData.password}
          onChange={handleInput}
        />

        <button>Login</button>
      </form>
    </>
  );
}

export default Login;
