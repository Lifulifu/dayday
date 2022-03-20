import { createContext, useState, useEffect } from "react";
import { authStateChangeListener, getUserDocRef } from "../utils/firebase.utils";

export const UserContext = createContext({
  currUser: null,
  setCurrUser: () => null
});


export const UserProvider = ({ children }) => {
  const [currUser, setCurrUser] = useState(null);
  const [userDocRef, setUserDocRef] = useState(null);
  const value = { currUser, userDocRef };
  const setCurrUserAndUserDocRef = async (user) => {
    setCurrUser(user);
    setUserDocRef(await getUserDocRef(user));
  }

  // update the currUser whenever auth changes
  useEffect(() => {
    const unsubscribe = authStateChangeListener((user) => {
      console.log('auth state changed.', user);
      setCurrUserAndUserDocRef(user);
    });
    return unsubscribe;
  }, [])

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}