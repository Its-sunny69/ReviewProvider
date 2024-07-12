import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import UserInput from "./components/UserInput";
import Home from "./components/Home";
import UserDashboard from "./components/UserDashboard";
import Review from "./components/Review";
import Form2 from "./components/Form2";
import GetData from "./components/GetData";
import SignUp from "./Auth/SignUp";
import { Toaster } from "react-hot-toast";
import Login from "./Auth/Login";
import { useEffect, useState } from "react";
import { auth } from "./Store/realtimeDB";

function App() {
  const [user, setUser] = useState();

  useEffect(() => {
    auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    console.log(user);
  }, []);
  return (
    <div className="select-none w-full">
      <BrowserRouter>
        <nav>
          <ul>
            <li>
              <Link to="/Home">Home</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route
            exact
            path="/"
            element={user ? <Navigate to="/Home" /> : <Login />}
          />
          <Route path="/Home" element={<Home />} />
          <Route path="/Form" element={<Form2 />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/review" element={<Review />} />
          <Route path="/getData" element={<GetData />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
