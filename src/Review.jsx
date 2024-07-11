import { useLocation, useNavigate } from "react-router-dom";

function Review() {
  const { state } = useLocation();
  let navigate = useNavigate();

  console.log(state);

  const getData = () => {
    navigate("/getData");
  };

  return (
    <>
      <p>This is Review</p>
      <button onClick={getData}>getData</button>
      {state && state.data && (
        <div>
          {Object.entries(state.data).map(([key, value], index) => (
            <div key={index}>
              {Object.entries(value.reviewQ.questions).map(([questionKey, questionValue], questionIndex) => (
                <p key={questionIndex} className="text-xl font-bold">
                  {questionKey}: {questionValue}
                </p>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default Review;