import { React, useState, useEffect, useContext } from 'react'

import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import "./easymde-override-style.css";
import { AiOutlineSave } from "react-icons/ai"

import { UserContext } from '../contexts/user.context';
import { DiaryManager } from '../utils/diaryManager';

const getDateStr = (date, delim) => {
  return (
    date.getFullYear() + delim +
    (date.getMonth() + 1) + delim +
    date.getDate()
  )
}


export default function Write() {

  const { userDocRef } = useContext(UserContext);
  const [dateStr, setDateStr] = useState(getDateStr(new Date(), '-'));
  const [diaryManager, setDiaryManager] = useState(null);

  useEffect(() => {
    setDiaryManager(new DiaryManager(userDocRef));
  }, [userDocRef])

  const onSaveClicked = async () => {
    diaryManager.setCurrDate(dateStr);
    await diaryManager.saveDiary({
      createdAt: new Date(),
      content: "ass"
    })
  }

  return (
    <div className="pt-8 h-screen">
      <div className="flex flex-col items-center">

        <div className="w-full md:max-w-2xl">
          <div className="flex justify-end items-center px-4 py-1">
            save
            <AiOutlineSave className='ml-2' onClick={onSaveClicked} />
          </div>

          <SimpleMDE
            value={`# ${dateStr}\n`}
            options={{
              autofocus: true,
              toolbar: false,
              spellChecker: false
            }} />
        </div>

      </div>
    </div>
  )
}
