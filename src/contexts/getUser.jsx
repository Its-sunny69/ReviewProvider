import React, { createContext, useContext, useEffect, useState } from 'react'
import { doc, getDoc } from "firebase/firestore";
import { auth, store } from "../Store/realtimeDB";


const authContext = createContext()

const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState(null)
    const [id, setId] = useState(null)

    const fetchUser = async () => {
        auth.onAuthStateChanged(async (user) => {
            setId(user.uid)
            const docRef = doc(store, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setUserData(docSnap.data());
            } else {
                console.log("User is not loggedin");
            }
        });
    };

    useEffect(() => {
        setTimeout(() => {
            fetchUser()
        }, 5)
    }, [])

    return (
        <authContext.Provider value={{ userData, id }}>
            {children}
        </authContext.Provider>
    )
}

const useAuth = () => {
    const context = useContext(authContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

export { AuthProvider, useAuth }