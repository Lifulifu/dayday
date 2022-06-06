import React from 'react'

export default function Modal({ children, isOpen, triggerClose, canClose, className }) {

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black/70 ${className}
    transition-all duration-200 ease-in-out`}
      onClick={() => canClose && triggerClose && triggerClose()}>
      <div className="fixed px-4 py-6 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
      bg-gray-100 rounded-lg text-center">
        {children}
      </div>
    </div>
  )
}
