import React from 'react'
import { Link } from 'react-router-dom'
import { FiEdit } from 'react-icons/fi'

export default function CollectionItem({ dateStr, content, url, className }) {
  return (
    <div className={`py-2 px-4 hover:bg-gray-200/50 rounded-lg ${className}`}>
      {
        dateStr.length > 0 ?
          <div className='mb-2 relative flex flex-row justify-center items-center'>
            <h2 className='px-4 font-mono font-extrabold text-gray-500 bg-gray-200 rounded-full'>
              {dateStr}</h2>
            <Link to={url}
              className='cursor-pointer absolute right-0'>
              <FiEdit className='text-gray-500'></FiEdit>
            </Link>
          </div>
          : null
      }
      <p className='break-words whitespace-pre-line'>
        {content}
      </p>
    </div>
  )
}
