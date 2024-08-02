import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function landing() {
  const navigate = useNavigate();
  return (
    <>
      <div className="w-full h-dvh">
        <Navbar />

        <div className="w-full mt-16 px-24 py-6 bg-slate-100">
          <div className=" my-2 mr-2 py-1 flex flex-col justify-center items-center text-center">
            <div className="py-2">
              <p className="text-5xl font-extrabold drop-shadow-md">
                Effortlessly gather testimonials from your customers.
              </p>
            </div>
            <div className="py-6">
              <p className="text-xl text-slate-600 drop-shadow-md">
                {" "}
                We understand that collecting testimonials can be challenging.
                That's why we created TrustVibes. Within minutes, you can
                collect text and video testimonials from your customers, without
                needing a developer or website hosting.
              </p>
            </div>
            <div className="py-2">
              <button
                className="border border-1 shadow-md border-blue-800 h-max px-3 py-1.5 rounded-3xl text-white font-mono font-bold text-md bg-blue-800 hover:bg-blue-100 hover:text-slate-900"
                onClick={() => navigate("/home")}
              >
                Try Free Now!
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
