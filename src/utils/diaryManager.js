import { db } from './firebase.utils'
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getUserDocRef } from './firebase.utils';

export class DiaryManager {

  setUser(userDocRef) {
    this.userDocRef = userDocRef;
  }

  async getDiary(dateStr) {
    const diaryDocRef = doc(this.userDocRef, 'diaries', dateStr);
    const diarySnap = await getDoc(diaryDocRef);
    if (diarySnap.exists)
      return diarySnap.data();
    return null;
  }

  async saveDiary(dateStr, content) {
    const diaryDocRef = doc(this.userDocRef, 'diaries', dateStr);
    const diarySnap = await getDoc(diaryDocRef);
    try {
      if (diarySnap.exists()) {
        const { createdAt } = diarySnap.data();
        await setDoc(diaryDocRef, {
          lastModified: new Date(),
          createdAt,
          content
        });
      }
      else {
        await setDoc(diaryDocRef, {
          lastModified: new Date(),
          createdAt: new Date(),
          content
        });
      }
    }
    catch (err) {
      console.log('error saving diary:', err, content);
    }
  }

}
