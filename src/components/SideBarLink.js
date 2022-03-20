import React from 'react'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { BsCircle } from 'react-icons/bs';

function SideBarLink(props) {
  const { icon, text, to, onClick } = props;
  return (
    <Link to={to}
      className="h-14 flex items-center cursor-pointer hover:bg-gray-300
    transition-all duration-200 ease-in-out"
      onClick={onClick}>
      <div className="w-14 flex flex-col items-center shrink-0">{icon}</div>
      <div className="flex-grow">{text}</div>
    </Link>
  )
}

SideBarLink.propTypes = {
  icon: PropTypes.element,
  text: PropTypes.string,
  onClick: PropTypes.func,
  to: PropTypes.string,
}

SideBarLink.defaultProps = {
  icon: <BsCircle />,
  text: '',
}

export default SideBarLink;
