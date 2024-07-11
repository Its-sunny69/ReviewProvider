import React, { useState } from "react";

function SignUp() {
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

  const handleSubmit = () => {
    e.preventDefault();

  }

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

        <button>Sign Up</button>
      </form>
    </>
  );
}

export default SignUp;
