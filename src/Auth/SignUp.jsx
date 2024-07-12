import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore"; 
import { store } from "../Store/realtimeDB";

function SignUp() {
  const [userData, setUserData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
  });

  const signup = async () => {
    const auth = getAuth();
    await createUserWithEmailAndPassword(auth, userData.email, userData.password)
      .then((userCredential) => {
        console.log("Signed up");
        
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        console.log(error.message);
      });

      try {
        const docRef = await addDoc(collection(store, "users", userData.uid), {
            fname: userData.fname,
            lname: userData.lname,
            email: userData.email,
            password: userData.password,
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
  };

  let name, value;
  const handleInput = (e) => {
    name = e.target.name;
    value = e.target.value;

    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  console.log(userData);
  return (
    <>
      <form className="w-3/5 flex flex-col" action="" onClick={handleSubmit}>
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

        <button onClick={signup}>Sign Up</button>
      </form>
    </>
  );
}

export default SignUp;
