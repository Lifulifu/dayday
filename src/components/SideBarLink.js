import React from 'react'
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import { BsCircle } from 'react-icons/bs';


function SideBarLink(props) {
  const { icon, text, to } = props;
  return (
    <NavLink to={to}
      className={({ isActive }) => (
        `${isActive ? 'bg-clr-highlight text-white' : 'hover:bg-gray-300'}
        h-14 flex items-center cursor-pointer 
        transition-colors duration-200 ease-in-out`)}>
      <div className="w-14 flex flex-col items-center shrink-0">{icon}</div>
      <div className="flex-grow">{text}</div>
    </NavLink >
  )
}

export default SideBarLink;
