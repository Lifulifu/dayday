import React from 'react'

export default function TagItem({ tagName, className, url }) {
  return (
    <button className={`py-2 px-4
    text-center text-gray-800 bg-gray-100 rounded-md hover:bg-gray-400
    transition-colors duration-200 ease-in-out ${className}`}>
      {tagName}
    </button>
  )
}
