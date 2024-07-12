import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GetData from "./GetData";
import { auth, store } from "../Store/realtimeDB";
import { doc, getDoc } from "firebase/firestore";

function Home() {
  const [userData, setUserData] = useState(null);

  const fatchUser = async () => {
    auth.onAuthStateChanged(async (user) => {
      console.log(user);
      const docRef = doc(store, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
        console.log(docSnap.data());
      } else {
        console.log("User is not loggedin");
      }
    });
  };

  useEffect(() => {
    setTimeout(() => {
      fatchUser();
    }, 2000);
  }, []);

  const navigate = useNavigate();

  const handleCreate = () => {
    navigate("/Form");
  };
  return (
    <>
      <div>
        {userData ? (
          <p>
            UserName: {userData.fname} {userData.lname}
          </p>
        ) : (
          console.log("UserData Loading...")
        )}

        <button>Logout</button>
        <p className="text-2xl font-bold">Create Space: </p>
        <button
          onClick={handleCreate}
          className="border-2 w-32 h-12 text-xl font-semibold font-sans rounded-lg bg-blue-400 text-white"
        >
          {" "}
          Create +{" "}
        </button>
        <GetData />
      </div>
    </>
  );
}

export default Home;
