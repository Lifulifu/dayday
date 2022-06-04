import { React, useEffect, useContext } from 'react'
import ContentContainer from '../components/ContentContainer';
import SquareButton from '../assets/SquareButton';

import { UserContext } from '../contexts/user.context';
import { diaryManager } from '../utils/diaryManager';
import { date2Str, offsetDate, isToday, date2IsoStr } from '../utils/common.utils';

export default function Tags() {
  const { userData } = useContext(UserContext);

  useEffect(() => {
    diaryManager.userData = userData;
    if (!userData) return;

  }, [userData])


  return (
    <ContentContainer>
      <SquareButton onClick={async () => {
        const dirty = await diaryManager.fetchDirtyDiaries(
          offsetDate(new Date(), -1));
        console.log(dirty)
      }}>refresh</SquareButton>
      <h1 className='text-4xl font-bold'>Top Tags</h1>
    </ContentContainer>
  )
}
