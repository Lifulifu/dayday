import React, { useRef, useEffect, useState, useContext } from 'react'
import Calendar from 'react-github-contribution-calendar'

import { date2IsoStr, offsetDate } from '../utils/common.utils';
import { UserContext } from '../contexts/user.context';
import { DiaryManager } from '../utils/diaryManager';

const PANEL_COLORS = [
  '#EEEEEE',
  'rgb(165 243 252)',
  'rgb(34 211 238)',
  'rgb(8 145 178)',
  'rgb(21 94 117)'
]

export default function History() {

  const { userData } = useContext(UserContext);
  const [diaryManager, setDiaryManager] = useState(new DiaryManager());
  const [calendarData, setCalendarData] = useState({});
  const currDate = useRef(new Date());

  useEffect(async () => {
    console.log('user state changed', userData);
    if (!userData) return;

    diaryManager.setUser(userData.userDocRef);
    const diaries = await diaryManager.fetchDiaryRange(
      offsetDate(currDate.current, -10), currDate.current);
    console.log('diaries', diaries);

    // convert array to map of {isoDate: level}
    setCalendarData(
      diaries.reduce((map, curr) => {
        const dateObj = curr.date.toDate();
        map[date2IsoStr(dateObj)] = Math.floor(Math.random() * 4) + 1;
        return map;
      }, {})
    );

  }, [userData])


  return (
    <div className='flex flex-col items-center px-8'>
      <div className="flex flex-col items-stretch w-full md:max-w-md mt-24">
        <Calendar
          values={calendarData}
          until={date2IsoStr(new Date())}
          panelAttributes={{ 'rx': 4, 'ry': 4 }}
          panelColors={PANEL_COLORS}
        />
      </div>
    </div>
  )
}
