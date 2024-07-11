import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {

  const navigate = useNavigate();

  const handleCreate = () => {
    navigate("/Form");
  };
  return (
    <>
      <div>
        <p>Create Space: </p>
        <button onClick={handleCreate}> Create + </button>
      </div>
    </>
  );
}

export default Home;
