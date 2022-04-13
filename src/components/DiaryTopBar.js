import React from 'react'
import { date2Str } from '../utils/common.utils'
import { AiOutlineCheckCircle } from 'react-icons/ai'

export default function DiaryTopBar({ date, saved }) {
  return (
    <nav className='w-full flex justify-end items-center'>
      <span className='py-2 px-4'>{date2Str(date)}</span>
      {saved ?
        (<>
          <AiOutlineCheckCircle className='mr-2 flex-shrink-0' />
          <span className='py-2 pr-8'>saved</span>
        </>)
        :
        <span className='py-2 pr-8'>saving...</span>}
    </nav>
  )
}
