import React, { useState } from 'react'
import SideBarItem from './SideBarItem'
import { BsCalendarCheck } from 'react-icons/bs'
import { AiOutlineMenu, AiOutlineEdit, AiOutlineHistory } from 'react-icons/ai'

export default function SideBar() {
  const [isExpand, setIsExpand] = useState(false);

  return (
    <div className={ `${ isExpand ? 'w-48' : 'w-14' }
    fixed top-0 left-0 h-screen
    flex flex-col overflow-hidden
    bg-gray-200 text-gray-800 shadow-md
    transition-all duration-200 ease-in-out` }>
      <SideBarItem icon={ <AiOutlineMenu/> } onClick={ () => setIsExpand(!isExpand) }/>
      <SideBarItem icon={ <AiOutlineEdit/> } text="Write"/>
      <SideBarItem icon={ <AiOutlineHistory/> } text="History"/>
      <SideBarItem icon={ <BsCalendarCheck/> } text="Routine"/>
    </div>
  )
}
