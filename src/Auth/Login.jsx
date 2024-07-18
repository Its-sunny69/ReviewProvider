import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../Store/realtimeDB";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  EyeInvisibleTwoTone,
  EyeTwoTone,
  CaretRightOutlined,
} from "@ant-design/icons";
import { AuthProvider, useAuth } from "../contexts/getUser";

function Login() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const { id } = useAuth()
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (id) {
      navigate("/home")
    }
  })

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
      <div className="w-full h-lvh flex justify-center items-center bg-slate-100">
        <form
          className="w-2/6 text-xl flex flex-col border-none p-5 shadow-lg rounded-md backdrop-blur-sm bg-blue-200"
          action=""
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col m-2">
            <label className=" font-extrabold drop-shadow-sm" htmlFor="email">
              Email:
            </label>
            <input
              className=" shadow-md py-1 px-2 m-2 rounded-md bg-blue-100 focus:outline-none focus:ring-[1.2px] ring-offset-red-300 ring-offset-0 ring-blue-500"
              type="email"
              name="email"
              value={userData.email}
              onChange={handleInput}
              required
            />
          </div>
          <div className="flex flex-col m-2">
            <label className="font-extrabold drop-shadow-sm" htmlFor="password">
              Password:
            </label>
            <div className="flex">
              <input
                className="w-10/12 shadow-md py-1 px-2 m-2 mr-0 rounded-md rounded-r-none bg-blue-100 focus:outline-none focus:ring-[1.2px] ring-offset-red-300 ring-offset-0 ring-blue-500"
                type={showPassword ? "text" : "password"}
                name="password"
                value={userData.password}
                onChange={handleInput}
                required
              />
              <button
                className="w-2/12 shadow-md py-1 px-2 m-2 ml-0 rounded-md rounded-l-none bg-blue-400 focus:outline-none focus:ring-[1.2px] ring-offset-red-300 ring-offset-0 ring-blue-500"
                type="button"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeTwoTone /> : <EyeInvisibleTwoTone />}
              </button>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center m-2">
            <button className="w-2/6 border border-1 shadow-md border-blue-800 h-max px-3 py-1.5 rounded-3xl text-white font-mono font-bold text-md bg-blue-800 hover:bg-blue-100 hover:text-slate-900">
              Login
            </button>
          </div>
          <div className="flex flex-col justify-center items-center m-2">
            <p className=" text-sm">
              New User?{" "}
              <a
                onClick={() => navigate("/signup")}
                className=" underline underline-offset-4 hover:text-slate-500 hover:cursor-pointer"
              >
                Create New Account {<CaretRightOutlined />}
              </a>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Login />
    </AuthProvider>
  )
}
