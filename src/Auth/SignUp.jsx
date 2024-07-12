import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import app, { store, auth } from "../Store/realtimeDB";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";


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
      console.log(user);
      console.log({email: user.email,
        fname: userData.fname,
        lname: userData.lname,})

      if (user) {
        await setDoc(doc(store, "users", user.uid), {
          email: user.email,
          fname: userData.fname,
          lname: userData.lname,
        });
      }

      console.log("User Signedup Successfully")
      toast.success("User Signedup Successfully", {
        position: "top-center",
        duration: 4000,
      })
      navigate('/')
    } catch (error) {
      console.log(error)
      toast.error(error.message, {
        position: "bottom-center",
        duration: 4000,
      })
    }
    
  };

  console.log(userData);
  return (
    <>
      <form className="w-3/5 flex flex-col" action="" onSubmit={handleSubmit}>
        <label htmlFor="fname">First Name: </label>
        <input
          className=" border border-black"
          type="text"
          name="fname"
          value={userData.fname}
          onChange={handleInput}
        />
        <label htmlFor="lname">Last Name: </label>
        <input
          className=" border border-black"
          type="text"
          name="lname"
          value={userData.lname}
          onChange={handleInput}
        />
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

        <button>Sign Up</button>
      </form>
    </>
  );
}

export default SignUp;
