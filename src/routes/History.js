import React, { useRef, useEffect, useState, useContext } from 'react'
import ActivityCalendar from 'react-activity-calendar'

import { date2IsoStr, offsetDate } from '../utils/common.utils';
import { UserContext } from '../contexts/user.context';
import { DiaryManager } from '../utils/diaryManager';

export default function History() {

  const { userData } = useContext(UserContext);
  const [diaryManager, setDiaryManager] = useState(new DiaryManager());
  const currDate = useRef(new Date());

  const data = [...Array(100).keys()]
    .map((i) => ({
      date: date2IsoStr(offsetDate(currDate.current, -i)),  // proceed to prev day
      level: Math.floor(Math.random() * 5),
      count: 0
    }))
    .reverse();  // the order of date cannot be reversed, reverse array back to get correct order

  console.log(data)


  useEffect(() => {
    console.log('user state changed', userData);
    if (!userData) return;

    diaryManager.setUser(userData.userDocRef);
    const dateStr = date2IsoStr(currDate.current);

    diaryManager.fetchDiaryRange(currDate.current, 3);

  }, [userData])


  return (
    <div className="flex flex-col items-center mt-24">
      <ActivityCalendar
        data={data}
        showWeekdayLabels={true}
        weekStart={1}
      />
    </div>
  )
}
