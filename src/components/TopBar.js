import React from 'react'

export default function TopBar({ leftChildren, rightChildren, className }) {
  return (
    <nav className={`fixed left-14 right-0 flex justify-between items-center bg-white/70  ${className}`}>
      <span className='flex flex-row'>{leftChildren}</span>
      <span className='flex flex-row'>{rightChildren}</span>
    </nav>
  )
}
