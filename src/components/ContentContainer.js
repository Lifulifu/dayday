import React from 'react'

export default function ContentContainer({ children }) {
  return (
    <div className="relative pt-10 px-6">
      <div className="flex flex-col items-center">
        <div className={`w-full md:max-w-2xl`}>
          {children}
        </div>
      </div>
    </div>
  )
}
