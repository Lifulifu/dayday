import { createContext, useState, useEffect, useContext } from "react";
import { UserContext } from './user.context';
import DiaryManager from "../utils/diaryManager";

export const CoreContext = createContext({
  diaryManager: null,
  tagLocationsByTagName: null
});

export const CoreProvider = ({ children }) => {
  const { userData } = useContext(UserContext);
  const [diaryManager, setDiaryManager] = useState(null);
  const [tagLocationsByTagName, setTagLocationsByTagName] = useState(null);

  // update the userData whenever auth changes
  useEffect(() => {
    if (!userData) return;
    const dm = new DiaryManager(userData);
    dm.getTagLocationsByTagName().then((res) => {
      setDiaryManager(dm)
      setTagLocationsByTagName(res)
    })
  }, [userData])

  return (
    <CoreContext.Provider value={{ diaryManager, tagLocationsByTagName }}>
      {children}
    </CoreContext.Provider>
  )
}