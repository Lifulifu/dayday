import { createContext, useState, useEffect } from "react";
import { auth, authStateChangeListener, getUserDocRef } from "../utils/firebase/firebase.utils";

export const UserContext = createContext({
  currUser: null,
  setCurrUser: () => null
});

export const UserProvider = ({ children }) => {
  const [currUser, setCurrUser] = useState(null);
  const value = { currUser, setCurrUser };

  // update the currUser whenever auth changes
  useEffect(() => {
    const unsubscribe = authStateChangeListener((user) => {
      console.log('auth state changed.', user);
      setCurrUser(user);
      if (user) {
        getUserDocRef(user);
      }
    });
    return unsubscribe;
  }, [])

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}