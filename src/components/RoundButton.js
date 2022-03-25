import React from 'react'

export default function RoundButton({ children, className, ...otherProps }) {
  return (
    <button className={`w-20 h-20
    text-center text-white bg-gray-700 rounded-full hover:bg-gray-500
    transition-all duration-200 ease-in-out ${className}`} {...otherProps}>
      {children}
    </button>
  )
}
