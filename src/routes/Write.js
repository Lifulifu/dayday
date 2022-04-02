import { React, useState, useRef, useEffect, useContext } from 'react'

import EasyMDE from "easymde";
import "easymde/dist/easymde.min.css";
import "./easymde-override-style.css";
import LeftArrow from '../assets/LeftArrow';
import RightArrow from '../assets/RightArrow';

import { UserContext } from '../contexts/user.context';
import { DiaryManager } from '../utils/diaryManager';
import { date2Str } from '../utils/common.utils';


const SAVE_DIARY_COOLDOWN = 1000;

export default function Write() {

  const { userData } = useContext(UserContext);
  console.log('fc userData', userData)

  const currDate = useRef(new Date());
  const fetchedDiary = useRef(null);  // stage newly fetched diary before render it to editor
  const editor = useRef(null);
  const canSwitchDiary = useRef(true);  // debounce switching diary

  const [diaryManager, setDiaryManager] = useState(new DiaryManager());
  const [animationClass, setAnimationClass] = useState('');
  const [displayDate, setDisplayDate] = useState('');
  const [saved, setSaved] = useState(true);

  // set content or just title if content is empty
  const displayDiaryContent = (dateStr, data) => {
    console.log('display diary', dateStr, data)
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
  const canSave = useRef(true);  // disable autosave when animation is running

  const triggerAutoSave = async (text) => {
    if (text === null || !canSave.current || !userData) return;
    setSaved(false);
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      await diaryManager.saveDiary(currDate.current, text);
      setSaved(true);
    }, SAVE_DIARY_COOLDOWN);
  }

  const proceedAnimation = async () => {
    switch (animationClass) {
      // pause slide-in animation until new diary data is ready (await fetchedDiary.current)
      case 'left-out':  // editor is hidden
        displayDiaryContent(
          date2Str(currDate.current), await fetchedDiary.current);
        canSave.current = true;
        setAnimationClass('left-in');
        break;
      case 'left-in':  // editor is back, animation finished
        setAnimationClass('');
        canSwitchDiary.current = true;
        break;
      case 'right-out':
        displayDiaryContent(
          date2Str(currDate.current), await fetchedDiary.current);
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
    editor.current = new EasyMDE({
      element: editorDom,  // will be sibling of editorDom, child of containerDom
      autofocus: true,
      toolbar: false,
      spellChecker: false
    });

    return () => {  // remove everything in container
      containerDom.innerHTML = '';
    }
  }, []);

  // on user and editor set
  useEffect(() => {
    console.log('user state changed', userData);
    if (!userData || !editor.current) return;

    // add eventlistener here because the handler depends on userData
    const onChangeHandler = (cm, delta) => {
      triggerAutoSave(cm.getValue());
    }
    editor.current.codemirror.on('change', onChangeHandler);

    // fetch today's diary and display to editor
    diaryManager.setUser(userData.userDocRef);
    (async function () {
      const data = await diaryManager.fetchDiary(currDate.current);
      fetchedDiary.current = data;
      displayDiaryContent(date2Str(currDate.current), data);
      canSave.current = true;
    })();

    return () => {
      editor.current.codemirror.off('change', onChangeHandler);
    }
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
