import { doc, setDoc, getDoc, getDocs, collection, query, where } from "firebase/firestore";
import { date2Str } from "./common.utils";

export class DiaryManager {

  setUser(userDocRef) {
    this.userDocRef = userDocRef;
  }

  async fetchDiary(date) {
    const dateStr = date2Str(date);
    console.log(`fetching diary ${dateStr}`)
    const diaryDocRef = doc(this.userDocRef, 'diaries', dateStr);
    const diarySnap = await getDoc(diaryDocRef);
    if (diarySnap.exists)
      return diarySnap.data();
    return null;
  }

  async saveDiary(inDate, content) {
    const dateStr = date2Str(inDate);
    console.log(`saving diary ${dateStr}`)
    const diaryDocRef = doc(this.userDocRef, 'diaries', dateStr);
    const diarySnap = await getDoc(diaryDocRef);

    const date = new Date(inDate.valueOf());
    date.setUTCHours(0, 0, 0, 0);  // round to start of day
    try {
      if (diarySnap.exists()) {
        const { createdAt } = diarySnap.data();
        await setDoc(diaryDocRef, {
          date,
          lastModified: new Date(),
          createdAt,
          content,
          length: content.length
        });
      }
      else {
        await setDoc(diaryDocRef, {
          date,
          lastModified: new Date(),
          createdAt: new Date(),
          content,
          length: content.length
        });
      }
    }
    catch (err) {
      console.log('error saving diary:', err, content);
    }
  }

  async fetchDiaries(startDate, endDate) {
    endDate = endDate ?? new Date();
    const end = new Date(endDate.valueOf());
    const start = new Date(startDate.valueOf());
    // start.setUTCHours(0, 0, 0, 0);
    end.setUTCHours(0, 0, 0, 0);
    console.log(`fetching diary from ${date2Str(start)} to ${date2Str(end)}`)

    const result = [];
    try {
      const diaryCollRef = collection(this.userDocRef, 'diaries');
      const q = query(diaryCollRef,
        where('date', '>=', start),
        where('date', '<=', end));
      const snap = await getDocs(q);
      snap.forEach((e) => {
        result.push(e.data());
      })
    }
    catch (err) {
      console.log('error fetching date range', err);
    }
    return result;
  }

}
