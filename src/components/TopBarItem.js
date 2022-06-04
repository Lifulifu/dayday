import React from 'react'

export default function TopBarItem({ children, className }) {
  return (
    <span className={`py-2 px-4 ${className}`}>
      {children}
    </span>
  )
}
