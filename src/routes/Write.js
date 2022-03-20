import React from 'react'
import MdEditor from '../components/MdEditor'

const getDateStr = (date, delim) => {
  return (
    date.getFullYear() + delim +
    date.getMonth() + delim +
    date.getDate()
  )
}

export default function Write() {

  return (
    <div className="pt-8 bg-gray-100">
      <MdEditor title={'## ' + getDateStr(new Date(), '-')} />
    </div>
  )
}
