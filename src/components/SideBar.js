import React, { useState } from 'react'
import SideBarItem from './SideBarItem'
import SideBarLink from './SideBarLink'
import { BsCalendarCheck } from 'react-icons/bs'
import {
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineEdit,
  AiOutlineHistory,
  AiOutlineUser,
  AiOutlineSetting
} from 'react-icons/ai'


export default function SideBar() {
  const [isExpand, setIsExpand] = useState(false);

  return (
    <>
      <nav className={`${isExpand ? 'w-72' : 'w-14'}
      fixed top-0 left-0 h-screen z-50
      flex flex-col overflow-hidden justify-between
      bg-gray-200 text-gray-800 shadow-md
      transition-all duration-200 ease-in-out` }>

        <div className='flex flex-col overflow-hidden'>
          <SideBarItem icon={
            isExpand ? <AiOutlineClose /> : <AiOutlineMenu />}
            onClick={() => setIsExpand(!isExpand)} />

          <SideBarLink icon={<AiOutlineEdit />}
            onClick={() => setIsExpand(false)} text="Write" to="/write" />

          <SideBarLink icon={<AiOutlineHistory />}
            onClick={() => setIsExpand(false)} text="History" to="/history" />

          <SideBarLink icon={<BsCalendarCheck />}
            onClick={() => setIsExpand(false)} text="Routine" to="/routine" />
        </div>

        <div className='flex flex-col overflow-hidden'>
          <SideBarLink icon={<AiOutlineUser />}
            onClick={() => setIsExpand(false)} text="Login" to="/profile" />

          <SideBarItem icon={<AiOutlineSetting />}
            onClick={() => setIsExpand(false)} text="Setting" />

          <div className="h-4"></div>
        </div>

      </nav>

      <div className={`${isExpand ? 'opacity-30' : 'hidden opacity-0'}
      w-screen h-screen fixed bg-black z-40 
      transition-all duration-200 ease-in-out` }
        onClick={() => setIsExpand(false)}></div>
    </>
  )
}
