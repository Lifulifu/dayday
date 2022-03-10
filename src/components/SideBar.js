import React, { useState } from 'react'
import SideBarItem from './SideBarItem'
import SideBarLink from './SideBarLink'
import { BsCalendarCheck } from 'react-icons/bs'
import { AiOutlineMenu, AiOutlineEdit, AiOutlineHistory } from 'react-icons/ai'

export default function SideBar() {
  const [isExpand, setIsExpand] = useState(false);

  return (
    <>
      <nav className={`${isExpand ? 'w-48' : 'w-14'}
      fixed top-0 left-0 h-screen z-50
      flex flex-col overflow-hidden
      bg-gray-200 text-gray-800 shadow-md
      transition-all duration-200 ease-in-out` }>
        <SideBarItem icon={<AiOutlineMenu />} onClick={() => setIsExpand(!isExpand)} />
        <SideBarLink icon={<AiOutlineEdit />} onClick={() => isExpand && setIsExpand(false)} text="Write" to="/write" />
        <SideBarLink icon={<AiOutlineHistory />} onClick={() => isExpand && setIsExpand(false)} text="History" to="/history" />
        <SideBarLink icon={<BsCalendarCheck />} onClick={() => isExpand && setIsExpand(false)} text="Routine" to="/routine" />
      </nav>

      <div className={`${isExpand ? 'opacity-30' : 'hidden opacity-0'}
      w-screen h-screen fixed bg-black z-40 
      transition-all duration-200 ease-in-out` }
        onClick={() => setIsExpand(false)}></div>
    </>
  )
}
