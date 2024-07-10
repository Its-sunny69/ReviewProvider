import { useNavigate } from "react-router-dom";

function Home() {
  let navigate = useNavigate();

  let handleCreate = () => {
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
