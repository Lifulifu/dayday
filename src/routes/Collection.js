import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { TagsContext } from '../contexts/tags.context';

import ContentContainer from '../components/ContentContainer'
import { diaryManager } from '../utils/diaryManager';

export default function Collection() {

  const { tagName } = useParams()
  const { tagLocationsByTagName } = useContext(TagsContext)
  const [tagContents, setTagContents] = useState([])  // array of {dateStr, content}

  useEffect(() => {
    if (!tagLocationsByTagName) return;

    const proms = tagLocationsByTagName[tagName].map(async (loc) => {
      const diary = await diaryManager.fetchDiary(loc.dateStr)
      return {
        dateStr: loc.dateStr,
        content: diaryManager.getDiaryLines(diary.content, loc.lineNum + 1, loc.nextTagLineNum)
      }
    })

    Promise.all(proms).then((res) => setTagContents(res))

  }, [tagLocationsByTagName])

  return (
    <ContentContainer>
      <h1 className='text-4xl font-bold'>{'Collection for '}
        <span className='text-clr-highlight'>#{tagName}</span>
      </h1>
      <div>
        {
          tagContents.map(({ dateStr, content }) => (
            <div key={dateStr}>
              <h2>{dateStr}</h2>
              <p>{content}</p>
            </div>
          ))
        }
      </div>
    </ContentContainer>
  )
}
