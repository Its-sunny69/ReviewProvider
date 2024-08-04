import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "../contexts/getUser";
import toast from "react-hot-toast";
import { auth } from "../Store/realtimeDB";
import Logo from "../assets/logo.svg";

function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [uid, setId] = useState(null);
  const { id, userData } = useAuth();

  useEffect(() => {
    if (id && pathname != "/login" && pathname != "/signup") {
      //console.log(id);
      setId(id);
    }
  }, [pathname, id]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast.success("User Logedout Successfully!!", {
        duration: 2000,
        position: "top-center",
      });
      setId(null);
      navigate("/login");
    } catch (error) {
      toast.error(error.message, {
        duration: 2000,
        position: "bottom-center",
      });
    }
  };

  if (pathname && pathname != "/login" && pathname != "/signup")
    return (
      <nav className="w-full py-2 flex justify-between z-50 sticky top-0 backdrop-blur-lg">
        <Link to={"/home"}>
          <div className="flex justify-around w-max gap-x-3 items-center px-4">
            <div className="w-14 h-14">
              <img src={Logo} alt="logo" />
            </div>
            <p className="text-blue-800 text-xl font-bold ">TrustVibes</p>
          </div>
        </Link>
        <div className="flex justify-evenly items-center px-4 gap-x-4">
          {uid ? (
            <>
              <div>
                {userData ? (
                  <p className="text-black font-extrabold text-2xl drop-shadow-sm">
                    {userData.fname.charAt(0).toUpperCase() +
                      userData.fname.slice(1)}
                  </p>
                ) : (
                  console.log("UserData Loading...")
                )}
              </div>
              <button
                className="flex items-center gap-x-2 border border-1 shadow-md border-red-500 h-max px-3 py-1.5 rounded-3xl text-white font-mono font-bold text-md bg-red-500 hover:bg-red-100 hover:text-slate-900"
                onClick={() => handleLogout()}
              >
                Logout
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9"
                  />
                </svg>
              </button>
            </>
          ) : (
            <>
              {pathname != "/login" && (
                <button
                  className="flex items-center justify-center border border-1 shadow-md px-3 py-1.5 rounded-3xl text-white font-mono font-bold text-md  border-blue-800 min-w-32 p-3 text-md bg-blue-600 hover:bg-blue-100 hover:text-black hover:opacity-65 hover:shadow-none"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
              )}
              {pathname != "/signup" && (
                <button
                  className="flex justify-center items-center border border-1 shadow-md px-3 py-1.5 text-md border-blue-800 min-w-32 h-max p-3 rounded-3xl text-black font-mono font-bold text-md bg-blue-100 hover:bg-blue-800 hover:text-white hover:opacity-65 hover:shadow-none"
                  onClick={() => navigate("/signup")}
                >
                  Signup
                </button>
              )}
            </>
          )}
        </div>
      </nav>
    );
}

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
    </AuthProvider>
  );
}
