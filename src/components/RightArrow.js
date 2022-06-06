import React from 'react'

export default function RightArrow({ className, ...props }) {
  return (
    <div className={`group rounded-full p-16 hover:bg-gray-200 opacity-50
    transition-colors duration-200 ease-in-out ${className}`} {...props}>
      <svg width="100" height="100" className={`-translate-x-1/2 stroke-gray-300 group-hover:stroke-gray-500
      transition-colors duration-200 ease-in-out`}>
        <path
          d="M 50 10 L 90 50 M 90 50 L 50 90"
          strokeWidth="6"
          strokeLinecap="round" />
      </svg>
    </div>
  )
}
