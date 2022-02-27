import React from 'react'
import PropTypes from 'prop-types';

import { BsCircle } from 'react-icons/bs';

function SideBarItem(props) {
  const { icon, text, onClick } = props;
  return (
    <div 
    className="h-14 flex items-center cursor-pointer hover:bg-gray-300
    transition-all duration-200 ease-in-out" 
    onClick={ onClick }>
      <div className="w-14 flex flex-col items-center shrink-0">{ icon }</div>
      <div className="flex-grow">{ text }</div>
    </div>
  )
}

SideBarItem.propTypes = {
  icon: PropTypes.element,
  text: PropTypes.string,
  onClick: PropTypes.func
}

SideBarItem.defaultProps = {
  icon: <BsCircle/>,
  text: '',
}

export default SideBarItem;
