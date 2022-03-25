import React from 'react'

export default function LeftArrow({ className, ...props }) {
  return (
    <div className={`rounded-full p-16 hover:bg-gray-200 ${className}`} {...props}>
      <svg width="100" height="100" className={`translate-x-1/2 stroke-gray-300 hover:stroke-gray-500`}>
        <path
          d="M 50 10 L 10 50 M 10 50 L 50 90"
          strokeWidth="6"
          strokeLinecap="round" />
      </svg>
    </div>
  )
}
