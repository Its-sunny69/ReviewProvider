import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import app, { store, auth } from "../Store/realtimeDB";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  EyeInvisibleTwoTone,
  EyeTwoTone,
  CaretRightOutlined,
} from "@ant-design/icons";

function SignUp() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    fname: "",
    lname: "",
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
      await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
      const user = auth.currentUser;
      // console.log(user);
      // //console.log({
      //   email: user.email,
      //   fname: userData.fname,
      //   lname: userData.lname,
      // });

      if (user) {
        await setDoc(doc(store, "users", user.uid), {
          email: user.email,
          fname: userData.fname,
          lname: userData.lname,
          spaces: [],
        });
      }

      console.log("User Signedup Successfully");
      toast.success("User Signedup Successfully", {
        position: "top-center",
        duration: 4000,
      });
      navigate("/");
    } catch (error) {
      console.log(error);
      let message = "An error occurred. Please try again.";
      switch (error.code) {
        case "auth/email-already-in-use":
          message = "The email address is already in use by another account.";
          break;
        case "auth/invalid-email":
          message = "The email address is badly formatted.";
          break;
        case "auth/operation-not-allowed":
          message =
            "Operation not allowed. Please enable this service in the console.";
          break;
        case "auth/weak-password":
          message = "The password must be 6 characters long or more.";
          break;
        case "auth/network-request-failed":
          message = "A network error occurred. Please check your connection.";
          break;
        case "auth/too-many-requests":
          message =
            "We have blocked all requests from this device due to unusual activity. Try again later.";
          break;
        case "auth/user-disabled":
          message = "The user account has been disabled.";
          break;
        default:
          break;
      }
      toast.error(message, {
        position: "bottom-center",
        duration: 4000,
      });
    }
  };

  //console.log(userData);

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="w-full h-lvh flex justify-center items-center bg-slate-100">
        <form
          className="w-2/6 text-xl flex flex-col border-none p-5 shadow-lg rounded-md backdrop-blur-sm bg-blue-200"
          action=""
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col m-2">
            <label className="font-extrabold drop-shadow-sm" htmlFor="fname">
              First Name:
            </label>
            <input
              className=" shadow-md py-1 px-2 m-2 rounded-md bg-blue-100 focus:outline-none focus:ring-[1.2px] ring-offset-red-300 ring-offset-0 ring-blue-500"
              type="text"
              name="fname"
              value={userData.fname}
              onChange={handleInput}
              required
            />
          </div>
          <div className="flex flex-col m-2">
            <label className="font-extrabold drop-shadow-sm" htmlFor="lname">
              Last Name:
            </label>
            <input
              className=" shadow-md py-1 px-2 m-2 rounded-md bg-blue-100 focus:outline-none focus:ring-[1.2px] ring-offset-red-300 ring-offset-0 ring-blue-500"
              type="text"
              name="lname"
              value={userData.lname}
              onChange={handleInput}
              required
            />
          </div>

          <div className="flex flex-col m-2">
            <label className="font-extrabold drop-shadow-sm" htmlFor="email">
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
              Sign Up
            </button>
          </div>
          <div className="flex flex-col justify-center items-center m-2">
            <p className=" text-sm">
              Already have an Account?{" "}
              <a
                onClick={() => navigate("/login")}
                className=" underline underline-offset-4 hover:text-slate-500 hover:cursor-pointer"
              >
                Login {<CaretRightOutlined />}
              </a>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}

export default SignUp;
