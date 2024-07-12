import { useState } from "react";
import { useNavigate } from "react-router-dom";
function UserInput() {
  let [input, setInput] = useState({
    firstname: "",
    headline: "",
    message: "",
  });

  let navigate = useNavigate();

  let handleNavigate = () => {
    navigate("/user-dashboard");
  };

  let name, value;

  let handleUserData = (e) => {
    name = e.target.name;
    value = e.target.value;
    setInput({ ...input, [name]: value });
  };

  let handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <>
      <form action="" onSubmit={handleSubmit}>
        <label htmlFor=""> Name : </label>
        <input
          type="text"
          onChange={handleUserData}
          name="firstname"
          value={input.firstname}
        />
        <label htmlFor=""> Headline: </label>
        <input
          type="text"
          onChange={handleUserData}
          name="headline"
          value={input.headline}
        />
        <label htmlFor="">Message: </label>
        <textarea
          name="message"
          id=""
          cols={30}
          rows={5}
          onChange={handleUserData}
          value={input.message}
        ></textarea>

        <button type="submit" onClick={handleNavigate}>
          Submit
        </button>
      </form>
    </>
  );
}

export default UserInput;
