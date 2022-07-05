import { React, useState, useEffect, useContext } from 'react'
import ContentContainer from '../components/ContentContainer';

import { CoreContext } from '../contexts/core.context';
import TagItem from '../components/TagItem';
import RefreshButton from '../components/RefreshButton';

export default function Tags() {

  const { diaryManager, tagLocationsByTagName, setTagLocationsByTagName } = useContext(CoreContext)

  useEffect(() => {
    onRefreshClicked();
  }, [diaryManager])

  const getTagItemsData = (tagLocationsByTagName) => {
    // array of { tagName, count, url }
    if (!tagLocationsByTagName)
      return [];

    const result = [];
    for (const tagName in tagLocationsByTagName) {
      if (tagName === '')
        continue
      result.push({
        tagName,
        count: tagLocationsByTagName[tagName].length,
        url: `collection/${tagName}`
      })
    }
    result.sort((a, b) => (b.count - a.count))
    return result;
  }

  const onRefreshClicked = async () => {
    if (!diaryManager) return;
    await diaryManager.updateTagLocations()
    const res = await diaryManager.getTagLocationsByTagName()
    setTagLocationsByTagName(res)
  }

  return (
    <ContentContainer>
      <div className='flex flex-row items-center sm:justify-start justify-center'>
        <h1 className='text-4xl font-bold'>Top Tags</h1>
        <RefreshButton onClick={onRefreshClicked} size={30} />
      </div>
      <div className='flex flex-row flex-wrap items-center gap-2'>
        {getTagItemsData(tagLocationsByTagName).map(({ tagName, count, url }) => (
          <TagItem key={tagName} tagName={tagName} count={count} url={url} />
        ))}
      </div>
    </ContentContainer>
  )
}
