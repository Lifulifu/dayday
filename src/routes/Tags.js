import { React, useState, useEffect, useContext } from 'react'
import ContentContainer from '../components/ContentContainer';
import SquareButton from '../assets/SquareButton';

import { UserContext } from '../contexts/user.context';
import { diaryManager } from '../utils/diaryManager';
import TagItem from '../components/TagItem';

export default function Tags() {
  const { userData } = useContext(UserContext);
  const [tagLocationsByTagName, setTagLocationsByTagName] = useState(null);

  useEffect(() => {
    diaryManager.userData = userData;
    if (!userData) return;
    diaryManager.fetchTagLocations().then((locationsByDate) => (
      setTagLocationsByTagName(diaryManager.getTagLocationsByTagName(locationsByDate))
    ))
    console.log('tagLocations', tagLocationsByTagName)
  }, [userData])

  const getTagItemsData = (tagLocations) => {
    // array of { tagName, count, url }
    const result = [];
    for (const tagName in tagLocations) {
      result.push({
        tagName,
        count: tagLocations[tagName].length,
        url: ''
      })
    }
    return result;
  }

  const updateTagLocations = async () => {
    const lastUpdate = await diaryManager.fetchTagLocationsLastUpdate()
    const dirtyDiaries = await diaryManager.fetchDirtyDiaries(lastUpdate)
    await diaryManager.updateTagLocationsFromDiaries(dirtyDiaries)
    diaryManager.saveTagLocationsLastUpdate(new Date())
    diaryManager.fetchTagLocations().then((locationsByDate) => (
      setTagLocationsByTagName(diaryManager.getTagLocationsByTagName(locationsByDate))
    ))
    console.log(`updated tags from ${dirtyDiaries.length} diaries`)
  }


  return (
    <ContentContainer>
      <h1 className='text-4xl font-bold'>Top Tags</h1>
      <SquareButton onClick={updateTagLocations}>refresh</SquareButton>
      <div>
        {getTagItemsData(tagLocationsByTagName).map(({ tagName, count, url }) => (
          <TagItem tagName={tagName} count={count}></TagItem>
        ))}
      </div>
    </ContentContainer>
  )
}
