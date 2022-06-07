import { createContext, useState, useEffect, useContext } from "react";
import { UserContext } from '../contexts/user.context';
import { diaryManager } from "../utils/diaryManager";

export const TagsContext = createContext({
  tagLocationsByTagName: null,
});

export const TagsProvider = ({ children }) => {
  const { userData } = useContext(UserContext);
  const [tagLocationsByTagName, setTagLocationsByTagName] = useState(null);

  // update the userData whenever auth changes
  useEffect(() => {
    diaryManager.userData = userData;
    if (!userData) return;
    diaryManager.fetchTagLocations()
      .then((locationsByDate) => (
        setTagLocationsByTagName(diaryManager.getTagLocationsByTagName(locationsByDate))
      ))
  }, [userData])


  return (
    <TagsContext.Provider value={{ tagLocationsByTagName }}>
      {children}
    </TagsContext.Provider>
  )
}