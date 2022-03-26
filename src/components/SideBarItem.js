import React from 'react'
import PropTypes from 'prop-types';

function SideBarItem(props) {
  const { icon, text, onClick, selected } = props;
  return (
    <div
      className={`${selected ? 'bg-clr-highlight text-white' : 'hover:bg-gray-300'}
      h-14 flex items-center cursor-pointer
      transition-all duration-200 ease-in-out`}
      onClick={onClick}>
      <div className="w-14 flex flex-col items-center shrink-0">{icon}</div>
      <div className="flex-grow">{text}</div>
    </div>
  )
}

SideBarItem.propTypes = {
  icon: PropTypes.element,
  text: PropTypes.string,
  onClick: PropTypes.func,
}


export default SideBarItem;
