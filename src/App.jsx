import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import "./App.css";
import LoadingPage from "./components/LoadingPage";
import Iframe from "./components/Iframe";
import Graph from "./pages/Graph";
import Social from "./pages/Social";
function App() {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    // console.log(user);
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="select-none w-full bg-[#222629]">
      <BrowserRouter>
        <Routes>
          <Route
            path="/home"
            element={
              user && !user.isAnonymous ? <Home /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/form"
            element={
              user && !user.isAnonymous ? <Form2 /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/user-dashboard"
            element={
              user && !user.isAnonymous ? (
                <UserDashboard />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/review/:reviewId?" element={<Review />} />
          <Route path="/iframe/:id/:cardindex" element={<Iframe />} />
          <Route
            path="/getData"
            element={
              user && !user.isAnonymous ? <GetData /> : <Navigate to="/login" />
            }
          />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/graph" element={<Graph />} />
          <Route path="/" element={<Landing />}></Route>
          <Route path="/social" element={<Social />} />
        </Routes>
      </BrowserRouter>

      <Toaster />
    </div>
  );
}

export default App;
