import React, { createContext, useContext, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, store } from "../Store/realtimeDB";
import { signInAnonymously, deleteUser } from "firebase/auth";
import { useLocation } from "react-router-dom";

const authContext = createContext();

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(true);
  const { state } = useLocation();
  const { pathname } = useLocation();
  console.log(state);

  const fetchUser = async () => {
    auth.onAuthStateChanged(async (user) => {
      //     console.log(user)
      //       if (!user && (user ? !user.isAnonymous: true)) {
      //         signInAnonymously(auth);
      //         console.log("anonymous");
      //       }
      //     console.log("after", user);

      //     console.log(user);
      //     user = auth.currentUser;
      //     setId(user.uid);
      //     const docRef = doc(store, "users", user.uid);
      //     const docSnap = await getDoc(docRef);
      //     if (docSnap.exists()) {
      //       setUserData(docSnap.data());
      //     } else {
      //       console.log("User is not loggedin");
      //     }
      //     setLoading(false);
      //   });
      // };

      if (!user) {
        if (pathname.startsWith("/review")) {
          try {
            await signInAnonymously(auth);
          } catch (err) {
            if (err.code === 'auth/too-many-requests') {
              toast.error('Too many requests. Please try again later.', {
                duration: 3000,
                position: 'top-center',
              });
            } else {
              console.error(err);
            }
          }
        } else {
          navigate("/login");
          return;
        }
      } else if (user.isAnonymous && !pathname.startsWith("/review")) {
        await auth.signOut();
        navigate("/login");
      } else {
        const docRef = doc(store, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      }
      setId(user ? user.uid : null);
      setLoading(false);
    });
  };

  useEffect(() => {
    setTimeout(() => {
      fetchUser();
    }, 5);
  }, [auth.currentUser]);

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

  useEffect(() => {
    handleLogout;
  });

  return (
    <authContext.Provider value={{ userData, id, loading }}>
      {children}
    </authContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(authContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
