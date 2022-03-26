import { doc, setDoc, getDoc, collection } from "firebase/firestore";
import { date2IsoStr } from "./common.utils";

export class DiaryManager {

  setUser(userDocRef) {
    this.userDocRef = userDocRef;
  }

  async fetchDiary(date) {
    const dateStr = date2IsoStr(date);
    console.log(`fetching diary ${dateStr}`)
    const diaryDocRef = doc(this.userDocRef, 'diaries', dateStr);
    const diarySnap = await getDoc(diaryDocRef);
    if (diarySnap.exists)
      return diarySnap.data();
    return null;
  }

  async saveDiary(date, content) {
    const dateStr = date2IsoStr(date);
    console.log(`saving diary ${dateStr}`)
    const diaryDocRef = doc(this.userDocRef, 'diaries', dateStr);
    const diarySnap = await getDoc(diaryDocRef);
    try {
      if (diarySnap.exists()) {
        const { createdAt } = diarySnap.data();
        await setDoc(diaryDocRef, {
          date,
          lastModified: new Date(),
          createdAt,
          content
        });
      }
      else {
        await setDoc(diaryDocRef, {
          date,
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

  async fetchDiaryRange(startDateStr, days) {
    console.log(`fetching diary from ${startDateStr}`)
    const diaryCollRef = collection(this.userDocRef, 'diaries');
    console.log(diaryCollRef);
  }

}
