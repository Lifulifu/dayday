import { db } from './firebase.utils'
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getUserDocRef } from './firebase.utils';

export class DiaryManager {
  constructor(userDocRef) {
    this.userDocRef = userDocRef;
  }

  setCurrDate(dateStr) {
    this.diaryDocRef = doc(this.userDocRef, 'diaries', dateStr);
  }

  async getDiary() {
    const diarySnap = await getDoc(this.diaryDocRef);
    if (diarySnap.exists)
      return diarySnap.data();
    else
      return null;
  }

  async saveDiary(data) {
    try {
      await setDoc(this.diaryDocRef, data);
    }
    catch (err) {
      console.log('error saving diary:', err, data);
    }
  }

}
