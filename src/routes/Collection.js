import React, { useContext, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CoreContext } from '../contexts/core.context';

import ContentContainer from '../components/ContentContainer'
import CollectionItem from '../components/CollectionItem'
import { BiArrowBack } from 'react-icons/bi'
import { str2Date } from '../utils/common.utils';

export default function Collection() {

  const { tagName } = useParams()
  const { diaryManager, tagLocationsByTagName } = useContext(CoreContext)
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

    Promise.all(proms).then((res) => {
      res.sort((a, b) => str2Date(a.dateStr) - str2Date(b.dateStr))
      setTagContents(res)
    })

  }, [tagLocationsByTagName])

  return (
    <ContentContainer>
      <Link to="/tags"
        className='w-14 h-14 fixed flex flex-col justify-center items-center left-14 top-0 cursor-pointer 
      hover:bg-gray-200/50 text-gray-500' >
        <BiArrowBack size={30} />
      </Link>

      <h1 className='text-4xl font-bold'>
        {'Collection for '}
        <span className='text-clr-highlight'>#{tagName}</span>
      </h1>

      <div>
        {
          tagContents.map(({ dateStr, content }) => (
            <CollectionItem
              key={dateStr} dateStr={dateStr} content={content} url={`/diary/${dateStr}`}
              className='my-4' />
          ))
        }
      </div>
    </ContentContainer>
  )
}
