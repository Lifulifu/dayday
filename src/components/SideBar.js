import React, { useState } from 'react'
import SideBarItem from './SideBarItem'
import SideBarLink from './SideBarLink'
import {
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineEdit,
  AiOutlineUser,
  AiOutlineSearch,
  AiOutlineSetting,
} from 'react-icons/ai'
import { BiNote } from 'react-icons/bi'
import { RiHashtag } from 'react-icons/ri'
import { date2Str, str2Date } from '../utils/common.utils'

export default function SideBar({ className }) {

  const [isExpand, setIsExpand] = useState(false);
  const onItemClick = () => {
    setIsExpand(false);
  }

  return (
    <div className={className}>
      {/* menu expand button, hided behind sideBar nav if not mobile screen */}
      <div className="w-14 h-14 flex flex-col items-center justify-center shrink-0 cursor-pointer
      hover:bg-gray-200/50 transition-colors duration-200 ease-in-out z-10"
        onClick={() => setIsExpand(true)}>
        <AiOutlineMenu /></div>

      {/* actual sideBar nav */}
      <nav className={`${isExpand ? 'w-72' : 'w-0 sm:w-14'}
      fixed left-0 inset-y-0
      flex flex-col overflow-hidden justify-between
      bg-gray-200 text-gray-800 shadow-md
      transition-all duration-200 ease-in-out z-20`}>

        <div className='flex flex-col overflow-hidden'>
          <SideBarItem icon={
            isExpand ? <AiOutlineClose /> : <AiOutlineMenu />}
            onClick={() => setIsExpand(!isExpand)} />

          <SideBarItem icon={<BiNote />}
            text="Note" to="/note" onClick={onItemClick} />

          <SideBarLink icon={<AiOutlineEdit />}
            text="Diary" to={`/diary/${date2Str(new Date())}`} onClick={onItemClick} />

          <SideBarLink icon={<RiHashtag />}
            text="Tags" to="/tags" onClick={onItemClick} />

          <SideBarLink icon={<AiOutlineSearch />}
            text="Search" to="/search" onClick={onItemClick} />

          <SideBarLink icon={<AiOutlineUser />}
            text="Profile" to="/profile" onClick={onItemClick} />
        </div>

        <div className='flex flex-col overflow-hidden'>
          <SideBarLink icon={<AiOutlineSetting />}
            text="Setting" to="/setting" onClick={onItemClick} />

          <div className="h-4"></div>
        </div>

      </nav>

      {/* cover background */}
      <div className={`${isExpand ? 'opacity-30' : 'hidden opacity-0'}
      fixed inset-0 bg-black
      transition-all duration-200 ease-in-out z-0` }
        onClick={() => setIsExpand(false)}></div>
    </div>
  )
}
