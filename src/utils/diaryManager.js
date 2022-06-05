import {
  doc, setDoc, getDoc, updateDoc, deleteDoc, getDocs,
  collection, query, where
} from "firebase/firestore";
import { date2Str } from "./common.utils";
import { groupBy } from "lodash"

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
    date.setHours(0, 0, 0, 0);  // round to start of day
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
        const now = new Date();
        await setDoc(diaryDocRef, {
          date,
          lastModified: now,
          createdAt: now,
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

  async saveTagLocationsLastUpdate(date) {
    try {
      await updateDoc(this.userData.userDocRef, { tagLocationsLastUpdate: date })
    }
    catch (err) {
      console.log('error setting tagLocationLastUpdate', err)
    }
  }

  async fetchTagLocationsLastUpdate(date) {
    try {
      const snap = await getDoc(this.userData.userDocRef)
      console.log(snap.data())
      return snap.data().tagLocationsLastUpdate.toDate()
    }
    catch (err) {
      console.log('error getting tagLocationLastUpdate', err)
    }
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

  collectTagLocationsFromDiary(diary) {
    // returns array of all tags in a diary 
    // {tagName, lineNum, col}
    const tagRE = /#[^#\s]*/g  // hashtag followed by any non-space, non-tag char 
    const lines = diary.content.split('\n')
    const result = [];
    lines.forEach((line, lineNum) => {
      let matchArr = null;
      while ((matchArr = tagRE.exec(line)) != null) {
        const tagName = matchArr[0].slice(1, matchArr[0].length) // exclude '#'
        result.push({
          tagName,
          lineNum,
          col: matchArr.index
        })
      }
    })
    return result;
  }

  async updateTagLocationsFromDiaries(diaries) {
    for (const diary of diaries) {
      const dateStr = date2Str(diary.date.toDate())
      const locations = this.collectTagLocationsFromDiary(diary)
      try {
        const locationsRef = doc(
          this.userData.userDocRef, 'tags', dateStr)
        if (locations.length > 0)
          await setDoc(locationsRef, { locations })
        else
          await deleteDoc(locationsRef)
      }
      catch (err) {
        console.log('error updating tag', err, dateStr, locations)
      }
    }
  }

  async fetchTagLocations() {
    const result = {}
    try {
      const ref = collection(this.userData.userDocRef, 'tags')
      const snap = await getDocs(ref)
      snap.forEach((e) => {
        result[e.id] = {
          ...e.data() // locations: array of {tagName, line, col}
        };
      })
    }
    catch (err) {
      console.log('error fetching tag locations', err)
    }
    return result;
  }

  getTagLocationsByTagName(locationsByDate) {
    // flatten locationsByDate
    const flattened = []
    for (const dateStr in locationsByDate) {
      locationsByDate[dateStr].locations.forEach(({ ...attrs }) => {
        flattened.push({ ...attrs, dateStr })
      })
    }
    return groupBy(flattened, ({ tagName }) => tagName);
  }

}

// singleton, only new it once
export const diaryManager = new DiaryManager();