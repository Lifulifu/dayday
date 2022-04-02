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

const SIDEBAR_ITEM_IDX = {
  write: 1,
  history: 2,
  routine: 3,
  profile: 4,
  setting: 5
}

export default function SideBar({ className }) {

  const [isExpand, setIsExpand] = useState(false);
  const itemOnClick = () => {
    setIsExpand(false);
  }

  return (
    <>
      <nav className={`${isExpand ? 'w-72' : 'w-14'}
      fixed top-0 left-0 h-screen
      flex flex-col overflow-hidden justify-between
      bg-gray-200 text-gray-800 shadow-md
      transition-all duration-200 ease-in-out ${className}`}>

        <div className='flex flex-col overflow-hidden'>
          <SideBarItem icon={
            isExpand ? <AiOutlineClose /> : <AiOutlineMenu />}
            onClick={() => setIsExpand(!isExpand)} />

          <SideBarLink icon={<AiOutlineEdit />}
            text="Write" to="/" onClick={itemOnClick} />

          <SideBarLink icon={<AiOutlineHistory />}
            text="History" to="/history" onClick={itemOnClick} />

          <SideBarLink icon={<BsCalendarCheck />}
            text="Routine" to="/routine" onClick={itemOnClick} />
        </div>

        <div className='flex flex-col overflow-hidden'>
          <SideBarLink icon={<AiOutlineUser />}
            text="Account" to="/account" onClick={itemOnClick} />

          <SideBarLink icon={<AiOutlineSetting />}
            text="Setting" to="/setting" onClick={itemOnClick} />

          <div className="h-4"></div>
        </div>

      </nav>

      <div className={`${isExpand ? 'opacity-30' : 'hidden opacity-0'}
      fixed inset-0 bg-black
      transition-all duration-200 ease-in-out` }
        onClick={() => setIsExpand(false)}></div>
    </>
  )
}
