import { createContext, useState, useEffect } from "react";
import { authStateChangeListener, getUserDocRef } from "../utils/firebase.utils";

export const UserContext = createContext({
  currUser: null,
  setCurrUser: () => null
});


export const UserProvider = ({ children }) => {
  // userData = {
  //   user       // firebase auth obj
  //   userDocRef // docRef from firestore user collection
  // }
  const [userData, setUserData] = useState(null);

  const setCurrUserAndUserDocRef = async (user) => {
    if (!user) {
      setUserData(null);
      return;
    }
    const userDocRef = await getUserDocRef(user);
    setUserData({ user, userDocRef });
  }

  // update the userData whenever auth changes
  useEffect(() => {
    const unsubscribe = authStateChangeListener((user) => {
      console.log('auth state changed.', user);
      setCurrUserAndUserDocRef(user);
    });
    return unsubscribe;
  }, [])

  const value = { userData };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}