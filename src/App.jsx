import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import UserInput from "./UserInput";
import Home from "./Home";
import UserDashboard from "./UserDashboard";
import Review from "./Review";
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
          <Route path="/Form" element={<UserInput />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/review" element={<Review />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
