import { React, useContext, useEffect, useState, useRef } from 'react'
import SquareButton from '../assets/SquareButton'

import Calendar from 'react-github-contribution-calendar'

import { logOut } from '../utils/firebase.utils'
import { offsetDate, date2IsoStr } from '../utils/common.utils'
import { UserContext } from '../contexts/user.context'
import { diaryManager } from '../utils/diaryManager'
import ContentContainer from '../components/ContentContainer'


const PANEL_COLORS = [
  '#EEEEEE',
  '#cce3e3',
  '#9bc4c4',
  '#608f8e',
  '#365e5d'
]

const LENGTH_THRESHOLDS = [
  0, 20, 50, 100
]

const length2Level = (length) => {
  for (let i = 0; i < LENGTH_THRESHOLDS.length; i++) {
    if (length <= LENGTH_THRESHOLDS[i])
      return i;
  }
  return PANEL_COLORS.length;
}

export default function Profile() {
  const { userData } = useContext(UserContext);
  const [calendarData, setCalendarData] = useState({});
  const currDate = useRef(new Date());

  console.log(calendarData)
  useEffect(() => {
    console.log('user state changed', userData);
    if (!userData) return;

    diaryManager.userData = userData
    diaryManager.fetchDiaries(
      offsetDate(currDate.current, -365),
      currDate.current
    ).then((diaries) => {
      console.log('diaries', diaries);
      setCalendarData( // convert array to map of {isoDate: level}
        diaries.reduce((map, diary) => {
          const dateObj = diary.date.toDate();
          map[date2IsoStr(dateObj)] = length2Level(diary.length);
          return map;
        }, {})
      );
    })

  }, [userData])

  return (<> {
    userData ?
      <ContentContainer>
        <div className='flex flex-col items-center'>
          <img src={userData.user.photoURL} alt="user photo" className="rounded-full" />
          <h1 className="text-2xl">{userData.user.displayName}</h1>

          <div className="flex flex-col items-stretch w-full sm:max-w-screen-sm mt-8">
            <Calendar
              values={calendarData}
              until={date2IsoStr(new Date())}
              panelAttributes={{ 'rx': 4, 'ry': 4 }}
              panelColors={PANEL_COLORS}
            />
          </div>

          <SquareButton className="mt-24" onClick={logOut}>
            Log out
          </SquareButton>
        </div>
      </ContentContainer>
      :
      null
  } </>)
}
