import { doc, setDoc, getDoc, getDocs, collection, query, where } from "firebase/firestore";
import { date2Str } from "./common.utils";

// Singleton class
class DiaryManager {

  constructor() {
    this.userData = null;
    this.setIsSaved = null;  // callback, call setIsSaved(true) if diary saved
    this.saveCooldown = 1000;

    this._saveFunc = null;
  }

  async fetchDiary(date) {
    const dateStr = date2Str(date);
    console.log(`fetching diary ${dateStr}`)
    const diaryDocRef = doc(this.userData.userDocRef, 'diaries', dateStr);
    const diarySnap = await getDoc(diaryDocRef);
    if (diarySnap.exists)
      return diarySnap.data();
    return null;
  }

  async saveDiary(inDate, content) {
    if (!this.userData) return;

    const dateStr = date2Str(inDate);
    const diaryDocRef = doc(this.userData.userDocRef, 'diaries', dateStr);
    const diarySnap = await getDoc(diaryDocRef);

    const date = new Date(inDate.valueOf());
    date.setUTCHours(0, 0, 0, 0);  // round to start of day
    try {
      if (diarySnap.exists()) {
        const { content: oldContent, createdAt } = diarySnap.data();
        if (oldContent !== content) { // only if content not dirty (effects lastModified date)
          await setDoc(diaryDocRef, {
            date,
            lastModified: new Date(),
            createdAt,
            content,
            length: content.length
          });
          console.log(`diary ${dateStr} updated`)
        }
        else {
          console.log(`diary ${dateStr} content is up to date`)
        }
      }
      else {
        await setDoc(diaryDocRef, {
          date,
          lastModified: new Date(),
          createdAt: new Date(),
          content,
          length: content.length
        });
        console.log(`diary ${dateStr} created`)
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
      const diaryCollRef = collection(this.userData.userDocRef, 'diaries');
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

  async fetchDirtyDiaries(afterDate = null) {
    const result = [];
    try {
      const collRef = collection(this.userData.userDocRef, 'diaries');
      let snap;
      if (!!afterDate) {
        const q = query(collRef,
          where('lastModified', '>', afterDate))
        snap = await getDocs(q)
      }
      else {
        snap = await getDocs(collRef);
      }
      snap.forEach((e) => {
        result.push(e.data());
      })
    }
    catch (err) {
      console.log('error fetching date after', date2Str(afterDate));
    }
    return result;
  }

  async triggerSave(date, text, force = false) {
    console.log(`diary ${date2Str(date)} save triggered`)
    if (text === null) return;
    if (!force) clearTimeout(this._saveFunc);
    this._saveFunc = setTimeout(async () => {
      await this.saveDiary(date, text);  // hopefully 'this' should refer to DiaryManager because it is in an arrow function
      this.setIsSaved(true);
    }, this.saveCooldown);
  }

  async saveTagLocation(tagName, dateStr, line) {
    if (tagName.length === 0)
      tagName = 'default';
    const locationsRef = doc(this.userData.userDocRef, 'tags', tagName, 'locations');
    const locationsSnap = await getDoc(locationsRef);
    try {
      let appendedLocations;
      if (locationsSnap.exists()) {
        appendedLocations = locationsSnap.data().push({ // fetch old arr and push new item
          dateStr, line
        });
      }
      else { // tag does not exist
        appendedLocations = [{ dateStr, line }]; // create a new arr
      }
      await setDoc(locationsRef, appendedLocations);
    }
    catch (err) {
      console.log('error saving tag', err);
    }
  }
}

// singleton, only new it once
export const diaryManager = new DiaryManager();