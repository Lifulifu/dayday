import React, { useState } from 'react'
import SideBarItem from './SideBarItem'
import SideBarLink from './SideBarLink'
import {
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineEdit,
  AiOutlineUser,
  AiOutlineSearch,
  AiOutlineSetting
} from 'react-icons/ai'

export default function SideBar({ className }) {

  const [isExpand, setIsExpand] = useState(false);
  const onItemClick = () => {
    console.log('yoyo')
    setIsExpand(false);
  }

  return (
    <div className={className}>
      <div className="w-14 h-14 flex flex-col items-center justify-center shrink-0 cursor-pointer
      hover:bg-gray-100 transition-colors duration-200 ease-in-out z-10"
        onClick={() => setIsExpand(true)}>
        <AiOutlineMenu /></div>

      <nav className={`${isExpand ? 'w-72' : 'w-0 sm:w-14'}
      fixed top-0 left-0 h-screen
      flex flex-col overflow-hidden justify-between
      bg-gray-200 text-gray-800 shadow-md
      transition-all duration-200 ease-in-out z-20`}>

        <div className='flex flex-col overflow-hidden'>
          <SideBarItem icon={
            isExpand ? <AiOutlineClose /> : <AiOutlineMenu />}
            onClick={() => setIsExpand(!isExpand)} />

          <SideBarLink icon={<AiOutlineEdit />}
            text="Write" to="/" onClick={onItemClick} />

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

      <div className={`${isExpand ? 'opacity-30' : 'hidden opacity-0'}
      fixed inset-0 bg-black
      transition-all duration-200 ease-in-out z-0` }
        onClick={() => setIsExpand(false)}></div>
    </div>
  )
}
