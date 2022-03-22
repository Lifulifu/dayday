import { React, useState, useRef, useEffect, useContext } from 'react'

import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import "./easymde-override-style.css";
import SquareButton from '../components/SquareButton';

import { UserContext } from '../contexts/user.context';
import { DiaryManager } from '../utils/diaryManager';

const getDateStr = (date, delim = '-') => {
  return (
    date.getFullYear() + delim +
    (date.getMonth() + 1) + delim +
    date.getDate()
  )
}

const SAVE_DIARY_COOLDOWN = 1000;

export default function Write() {

  const { userData } = useContext(UserContext);

  const [currDate, setCurrDate] = useState(null);

  const diaryManager = useRef(new DiaryManager());
  useEffect(() => {
    if (userData) {
      diaryManager.current.setUser(userData.userDocRef);
      setCurrDate(new Date());
    }
  }, [userData])

  const [editorText, setEditorText] = useState('');
  const setDiaryContent = async (date) => {
    if (!date) return;

    const dateStr = getDateStr(date);
    console.log(`fetch diary ${dateStr}`);
    const data = await diaryManager.current.getDiary(dateStr);
    if (data && data.content !== '')
      setEditorText(data.content);
    else
      setEditorText(`# ${dateStr}\n`);
  }

  const onEditorChange = (content) => {
    setEditorText(content);
    triggerAutoSave();
  }

  useEffect(() => {  // diary content react with dateStr
    setDiaryContent(currDate);
  }, [currDate]);

  const timer = useRef(null);
  const [saved, setSaved] = useState(true);
  const triggerAutoSave = async () => {
    setSaved(false);
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      await diaryManager.current.saveDiary(
        getDateStr(currDate), editorText);
      setSaved(true);
    }, SAVE_DIARY_COOLDOWN);
  }

  const [animationClass, setAnimationClass] = useState('');
  const proceedAnimation = () => {
    switch (animationClass) {
      case 'left-out':
        setAnimationClass('left-in');
        break;
      case 'left-in':
        setAnimationClass('');
        break;
      case 'right-out':
        setAnimationClass('right-in');
        break;
      case 'right-in':
        setAnimationClass('');
        break;
      default:
        setAnimationClass('');
    }
  }

  const toNextDay = async () => {
    setAnimationClass('left-out');
    const newDate = new Date();
    newDate.setDate(currDate.getDate() + 1);
    setCurrDate(newDate);
  }

  const toPrevDay = async () => {
    setAnimationClass('right-out');
    const newDate = new Date();
    newDate.setDate(currDate.getDate() - 1);
    setCurrDate(newDate);
  }

  return (
    <div className="pt-8 h-screen">
      <div className="flex flex-col items-center overflow-hidden">

        <div>
          <SquareButton onClick={toPrevDay}>{'<'}</SquareButton>
          <SquareButton onClick={toNextDay}>{'>'}</SquareButton>
        </div>

        <div className="w-full md:max-w-2xl">
          <SimpleMDE
            className={animationClass}
            value={editorText}
            onChange={onEditorChange}
            onAnimationEnd={proceedAnimation}
            options={{
              autofocus: true,
              toolbar: false,
              spellChecker: false
            }} />
          <div>{saved ? 'saved' : 'saving...'}</div>
        </div>

      </div>
    </div>
  )
}
