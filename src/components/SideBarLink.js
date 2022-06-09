import React from 'react'
import { Link, useLocation } from 'react-router-dom';

function compareRoutePrefix(a, b, level = 1) {
  try {
    return a.split('/')[level] === b.split('/')[level];
  }
  catch (err) {
    return false;
  }
}

function SideBarLink({ icon, text, to, onClick }) {

  const location = useLocation()
  const isActive = () => compareRoutePrefix(location.pathname, to)

  return (
    <Link to={to} onClick={onClick}
      className={
        `${isActive() ? 'bg-clr-highlight text-white' : 'hover:bg-gray-300'}
        h-14 flex items-center cursor-pointer 
        transition-colors duration-200 ease-in-out`}>
      <div className="w-14 flex flex-col items-center shrink-0">{icon}</div>
      <div className="flex-grow">{text}</div>
    </Link >
  )
}

export default SideBarLink;
