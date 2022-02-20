import React, { useState } from 'react'
import SideBarItem from './SideBarItem'
import { BsCalendarCheck } from 'react-icons/bs'
import { AiOutlineMenu, AiOutlineEdit, AiOutlineHistory } from 'react-icons/ai'

export default function SideBar() {
  const [isExpand, setIsExpand] = useState(false);

  return (
    <div className={ `w-${ isExpand ? 96 : 14 }
    fixed top-0 left-0 h-screen
    flex flex-col overflow-hidden
    bg-gray-200 text-gray-800 shadow-md` }>
      <SideBarItem icon={ <AiOutlineMenu/> } onClick={ () => setIsExpand(!isExpand) }/>
      <SideBarItem icon={ <AiOutlineEdit/> } text="Write"/>
      <SideBarItem icon={ <AiOutlineHistory/> } text="History"/>
      <SideBarItem icon={ <BsCalendarCheck/> } text="Routine"/>
    </div>
  )
}
