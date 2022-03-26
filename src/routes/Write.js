import { React, useState, useRef, useEffect, useContext } from 'react'

import EasyMDE from "easymde";
import "easymde/dist/easymde.min.css";
import "./easymde-override-style.css";
import LeftArrow from '../assets/LeftArrow';
import RightArrow from '../assets/RightArrow';

import { UserContext } from '../contexts/user.context';
import { DiaryManager } from '../utils/diaryManager';
import { date2IsoStr } from '../utils/common.utils';


const SAVE_DIARY_COOLDOWN = 1000;

export default function Write() {

  const { userData } = useContext(UserContext);

  const currDate = useRef(new Date());
  const fetchedDiary = useRef(null);  // stage newly fetched diary before render it to editor
  const editor = useRef(null);
  const canSwitchDiary = useRef(true);

  const [diaryManager, setDiaryManager] = useState(new DiaryManager());
  const [animationClass, setAnimationClass] = useState('');
  const [displayDate, setDisplayDate] = useState('');

  // set content or just title if content is empty
  const setDiaryContent = (dateStr, data) => {
    console.log('set diary', dateStr, data)
    if (data) {
      setDisplayDate(dateStr);
      editor.current.value(data.content);
    }
    else {
      setDisplayDate(dateStr);
      editor.current.value('');
    }
  }

  const timer = useRef(null);
  const [saved, setSaved] = useState(true);
  const canSave = useRef(false);

  const triggerAutoSave = async (text) => {
    if (text === null || !canSave.current) return;
    setSaved(false);
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      await diaryManager.saveDiary(currDate.current, text);
      setSaved(true);
    }, SAVE_DIARY_COOLDOWN);
  }

  // pause slide-in animation until new diary data is ready
  const proceedAnimation = async () => {
    switch (animationClass) {
      case 'left-out':
        setDiaryContent(
          date2IsoStr(currDate.current), await fetchedDiary.current);
        canSave.current = true;
        setAnimationClass('left-in');
        break;
      case 'left-in':
        setAnimationClass('');
        canSwitchDiary.current = true;  // animation finished
        break;
      case 'right-out':
        setDiaryContent(
          date2IsoStr(currDate.current), await fetchedDiary.current);
        canSave.current = true;
        setAnimationClass('right-in');
        break;
      case 'right-in':
        setAnimationClass('');
        canSwitchDiary.current = true;
        break;
      default:
        console.log(`Unexpected animationClass: '${animationClass}'`)
    }
  }

  const toNextDay = () => {
    if (!canSwitchDiary.current) return;
    currDate.current.setDate(currDate.current.getDate() + 1);
    // stage newly fetched diary before render it to editor
    fetchedDiary.current = diaryManager.fetchDiary(currDate.current)
    setAnimationClass('left-out');
    canSwitchDiary.current = false;  // lock
    canSave.current = false;
  }

  const toPrevDay = async () => {
    if (!canSwitchDiary.current) return;
    currDate.current.setDate(currDate.current.getDate() - 1);
    // stage newly fetched diary before render it to editor
    fetchedDiary.current = diaryManager.fetchDiary(currDate.current);
    setAnimationClass('right-out');
    canSwitchDiary.current = false;  // lock
    canSave.current = false;
  }

  // on mounted
  useEffect(() => {
    // create editor dom ele
    const containerDom = document.getElementById('editor-container');
    const editorDom = document.createElement('textarea');
    containerDom.append(editorDom);
    const newEditor = new EasyMDE({
      element: editorDom,  // will be sibling of editorDom, child of containerDom
      autofocus: true,
      toolbar: false,
      spellChecker: false
    });

    // on Editor change
    const onChangeHandler = (cm, delta) => {
      if (!userData) return;
      triggerAutoSave(cm.getValue());
    }
    newEditor.codemirror.on('change', onChangeHandler);
    editor.current = newEditor;

    return () => {  // remove everything in container
      newEditor.codemirror.off('change', onChangeHandler);
      containerDom.innerHTML = '';
    }
  }, []);

  // on user and editor set
  useEffect(() => {
    console.log('user state changed', userData);
    if (!userData || !editor.current) return;

    diaryManager.setUser(userData.userDocRef);

    (async function () {
      const data = await diaryManager.fetchDiary(currDate.current);
      fetchedDiary.current = data;
      setDiaryContent(date2IsoStr(currDate.current), data);
      canSave.current = true;
    })();

  }, [userData, editor.current])


  return (
    <>
      <div className="relative pt-16 h-screen overflow-x-hidden">
        <div className="flex flex-col items-center overflow-hidden">

          <LeftArrow className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 z-10" onClick={toPrevDay} />
          <RightArrow className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 z-10" onClick={toNextDay} />

          <div className={`w-full md:max-w-2xl z-0 ${animationClass}`} onAnimationEnd={proceedAnimation}>
            <h1 className='text-4xl'>{displayDate}</h1>
            <div id="editor-container"></div>
            <div>{saved ? 'saved' : 'saving...'}</div>
          </div>

        </div>
      </div >
    </>
  )
}
