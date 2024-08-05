import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GetData from "./GetData";
import { AuthProvider, useAuth } from "../contexts/getUser";
import Navbar from "./Navbar";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

function Home() {
  const navigate = useNavigate();
  const userData = useAuth().userData;
  const [loading, setLoading] = useState(true);
  const handleCreate = () => {
    navigate("/form");
  };

  const handleLoading = () => {
    setLoading(false);
    clearTimeout(loadingFalse);
  };

  const loadingFalse = setTimeout(handleLoading, 1000);

  return (
    <>
      <div className="w-full h-dvh">
        <Navbar />

        <div className="w-full bg-slate-100 sm:px-24 px-10 py-6">
          <div className=" flex sm:flex-row flex-col justify-between items-center sm:my-24 mb-10">
            <div className=" sm:w-7/12 my-2 mr-2 py-1 flex flex-col">
              <div className="py-2">
                <p className="sm:text-5xl text-3xl font-extrabold drop-shadow-md">
                  Don't Know How To Create Space ?
                </p>
              </div>
              <div className="py-6">
                <p className="text-xl text-slate-600 drop-shadow-md">
                  Here is Quick Tutorial which will guide you to the working of
                  our Service 😄
                </p>
              </div>
            </div>
            <div className=" sm:w-5/12 w-full ml-2 flex justify-center items-center">
              <div className="w-full pt-[56.25%] sm:m-2 relative flex justify-center items-center rounded-lg">
                <div className="absolute top-0 bottom-0 right-0 left-0 flex justify-center items-center">
                  <div className="relative w-full max-w-xs sm:max-w-md mx-auto" style={{ paddingTop: '56.25%' /* 16:9 Aspect Ratio */ }}>
                    {loading ? (
                      <SkeletonTheme baseColor="#c3c3c3" highlightColor="#e7e7e7">
                        <Skeleton
                          className="absolute top-0 left-0 w-full h-full rounded-lg"
                          style={{ aspectRatio: '16 / 9' }}
                        />
                      </SkeletonTheme>
                    ) : (
                      <iframe
                        className="absolute top-0 left-0 w-full h-full rounded-lg"
                        src="https://www.youtube.com/embed/qhduKvNismc?si=srhGYQX0Yp_QK1Ey"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        onLoad={handleLoading}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr className="w-[95%] h-[2px] my-2 mx-auto bg-blue-800 shadow-sm" />
          <div className="flex flex-row justify-between items-center sm:my-16 my-10">
            <p className="text-2xl font-bold">Spaces </p>
            <button
              onClick={handleCreate}
              className="px-3 py-1 text-md font-bold rounded-2xl border border-blue-400 bg-blue-400 text-white hover:bg-blue-100 hover:text-black"
            >
              Create Space +
            </button>
          </div>
          <div>
            <GetData />
          </div>
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Home />
    </AuthProvider>
  );
}
