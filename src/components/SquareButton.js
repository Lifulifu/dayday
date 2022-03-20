import React from 'react'

export default function SquareButton({ children, className, ...otherProps }) {
  return (
    <button className={`py-2 px-8
    text-center text-white bg-gray-700 rounded-md hover:bg-gray-500
    transition-all duration-200 ease-in-out ${className}`} {...otherProps}>
      {children}
    </button>
  )
}
