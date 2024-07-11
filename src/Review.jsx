import { useNavigate } from "react-router-dom";

function Review() {
  let navigate = useNavigate();

  const getData = () => {
    navigate("/getData");
  };
  return (
    <>
      <p>This is Review</p>
      <button onClick={getData}>getData</button>
    </>
  );
}

export default Review;
