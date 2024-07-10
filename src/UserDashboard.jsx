import { useNavigate } from "react-router-dom";

function UserDashboard() {
  let navigate = useNavigate();
  let handleSubmit = () => {
    navigate("/review");
  };
  return (
    <>
      <p>This is user Dashboard</p>
      <button onClick={handleSubmit}>Submit</button>
    </>
  );
}

export default UserDashboard;
