import React from 'react'
import { Link } from 'react-router-dom'

export default function TagItem({ tagName, count, url, className }) {
  return (
    <Link to={url} className={`py-2 px-4
    text-center text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300
    transition-colors duration-200 ease-in-out ${className}`}>
      <span className='font-extrabold text-gray-800'>{tagName}</span>
      <span className='ml-2'>({count})</span>
    </Link>
  )
}
