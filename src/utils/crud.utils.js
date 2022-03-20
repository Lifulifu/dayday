import { db } from './firebase.utils'
import { collection, addDoc, setDoc } from "firebase/firestore";

// get/set diary
const getDiaryRef = (userDocRef, dateStr) => {
  const diaryDocRef = doc(userDocRef, 'diaries', dateStr);
  return diaryDocRef;
}

const getDiaryData = (diaryDocRef) => {

}

const saveDiary = (diaryDocRef, data) => {
  return (data) => {
    try {
      await setDoc(diaryDocRef,)
    }
}
}
