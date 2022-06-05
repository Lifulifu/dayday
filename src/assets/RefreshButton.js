import React from 'react'
import { IoMdRefresh } from 'react-icons/io'

export default function RefreshButton({ size, className, ...props }) {
  return (
    <div className={`rounded-full p-4 hover:bg-gray-200 opacity-50
    transition-colors duration-200 ease-in-out cursor-pointer ${className}`} {...props}>
      <IoMdRefresh size={size} />
    </div>
  )
}
