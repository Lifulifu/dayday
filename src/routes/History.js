import React, { useRef, useEffect, useState, useContext } from 'react'
import ActivityCalendar from 'react-activity-calendar'

import { date2IsoStr, offsetDate } from '../utils/common.utils';
import { UserContext } from '../contexts/user.context';
import { DiaryManager } from '../utils/diaryManager';

export default function History() {

  const { userData } = useContext(UserContext);
  const [diaryManager, setDiaryManager] = useState(new DiaryManager());
  const [graphData, setGraphData] = useState([]);
  const currDate = useRef(new Date());

  useEffect(async () => {
    console.log('user state changed', userData);
    if (!userData) return;

    diaryManager.setUser(userData.userDocRef);
    const dateStr = date2IsoStr(currDate.current);

    const diaries = await diaryManager.fetchDiaryRange(
      offsetDate(currDate.current, -10), currDate.current);
    console.log('diaries', diaries);
    setGraphData(
      diaries.map((diary) => ({
        date: date2IsoStr(diary.date.toDate()),
        level: 2,
        count: 2
      }))
    )

  }, [userData])


  return (
    <div className="flex flex-col items-center mt-24">
      <ActivityCalendar
        data={graphData}
        showWeekdayLabels={true}
        weekStart={1}
      />
    </div>
  )
}
