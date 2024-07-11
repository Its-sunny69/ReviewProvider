import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import UserInput from "./UserInput";
import Home from "./Home";
import UserDashboard from "./UserDashboard";
import Review from "./Review";
import Form2 from "./Form2";
import GetData from "./GetData";
import SignUp from "./Auth/SignUp";
function App() {
  return (
    <div>
      <BrowserRouter>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/Form" element={<Form2 />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/review" element={<Review />} />
          <Route path="/getData" element={<GetData />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
