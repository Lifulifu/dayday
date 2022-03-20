import { initializeApp } from 'firebase/app'
import {
  getAuth,
  // signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import {
  getFirestore,
  doc, getDoc, setDoc
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCgRAZjL18Xnw6IaV6XmFrwRspAHBLK09s",
  authDomain: "dayday-dev.firebaseapp.com",
  projectId: "dayday-dev",
  storageBucket: "dayday-dev.appspot.com",
  messagingSenderId: "335619017038",
  appId: "1:335619017038:web:7f14f8e351d308a133761f",
  measurementId: "G-EVQ2RG1RFJ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore();  // singleton

const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: 'select_account',
});

export const auth = getAuth();  // singleton
export const logInWithGooglePopup = () => signInWithPopup(auth, provider);

const createUserDoc = async (userAuth, userDocRef) => {
  const { displayName, email } = userAuth;
  const createdAt = new Date();
  try {
    await setDoc(userDocRef, {
      displayName,
      email,
      createdAt
    });
  }
  catch (err) {
    console.log(`error setting user to db.`, err);
  }
}

export const getUserDocRef = async (userAuth) => {
  const userDocRef = doc(db, 'users', userAuth.uid);
  const userDocSnap = await getDoc(userDocRef);

  // Add to db if user not found
  if (!userDocSnap.exists()) {
    console.log(`user ${userAuth.uid} does not exist, creating doc.`)
    createUserDoc(userAuth, userDocRef);
  }
  return userDocRef;
}

export const logOut = async () => await signOut(auth);

export const authStateChangeListener = (callback) => onAuthStateChanged(auth, callback);