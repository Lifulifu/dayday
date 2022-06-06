import { React, useState, useEffect, useContext } from 'react'
import ContentContainer from '../components/ContentContainer';

import { UserContext } from '../contexts/user.context';
import { diaryManager } from '../utils/diaryManager';
import TagItem from '../components/TagItem';
import RefreshButton from '../components/RefreshButton';

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
      if (tagName === '')
        continue
      result.push({
        tagName,
        count: tagLocations[tagName].length,
        url: ''
      })
    }
    result.sort((a, b) => (b.count - a.count))
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
      <div className='flex flex-row items-center'>
        <h1 className='text-4xl font-bold'>Top Tags</h1>
        <RefreshButton onClick={updateTagLocations} size={30} />
      </div>
      <div className='flex flex-row flex-wrap items-center gap-2'>
        {getTagItemsData(tagLocationsByTagName).map(({ tagName, count, url }) => (
          <TagItem key={tagName} tagName={tagName} count={count} url={`collection/${tagName}`} />
        ))}
      </div>
    </ContentContainer>
  )
}
