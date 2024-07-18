import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "./components/Home";
import UserDashboard from "./components/UserDashboard";
import Review from "./components/Review";
import Form2 from "./components/Form2";
import GetData from "./components/GetData";
import SignUp from "./Auth/SignUp";
import Landing from "./components/Landing";
import { Toaster } from "react-hot-toast";
import Login from "./Auth/Login";
import { useEffect, useState } from "react";
import { auth } from "./Store/realtimeDB";
import Navbar from "./components/Navbar";
import './App.css'

function App() {
  const [user, setUser] = useState();

  useEffect(() => {
    auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    console.log(user);
  }, []);
  return (
    <div className="select-none w-full bg-slate-100">
      <BrowserRouter>
        <Routes>
          <Route
            path="/home"
            element={user ? <Home /> : <Navigate to="/login" />}
          />
          <Route path="/form" element={<Form2 />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/review/:reviewId?" element={<Review />} />
          <Route path="/getData" element={<GetData />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Landing />}></Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
