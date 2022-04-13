import React from 'react'

import DatePicker from 'react-datepicker';
import { BsCalendar3 } from 'react-icons/bs'
import { AiOutlineRight, AiOutlineLeft } from 'react-icons/ai'

export default function DaydayDatePicker({ onChange, selected, className }) {
  return (
    <div className={`flex items-center ${className}`}>
      <AiOutlineLeft />
      <div className={'rounded-full hover:bg-gray-100'}>
        <DatePicker
          onChange={onChange}
          selected={selected}
          customInput={<BsCalendar3 className='h-full' />}
        />
      </div>
      <AiOutlineRight />
    </div>
  )
}
