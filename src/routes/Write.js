import { React, useState, useRef, useEffect, useContext } from 'react'

import EasyMDE from "easymde";
import "easymde/dist/easymde.min.css";
import "./easymde-override-style.css";
import RoundButton from '../components/RoundButton';
import LeftArrow from '../assets/LeftArrow';
import RightArrow from '../assets/RightArrow';

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

  const currDate = useRef(new Date());
  const fetchedDiary = useRef(null);  // stage newly fetched diary before render it to editor
  const editor = useRef(null);
  const canSwitchDiary = useRef(true);

  const [diaryManager, setDiaryManager] = useState(new DiaryManager());
  const [animationClass, setAnimationClass] = useState('');

  // set content or just title if content is empty
  const setDiaryContent = async (dateStr, data) => {
    console.log('set diary', dateStr, data)
    if (data)
      editor.current.value(data.content);
    else
      editor.current.value('');
  }

  const timer = useRef(null);
  const [saved, setSaved] = useState(true);

  const triggerAutoSave = async (text) => {
    if (!text || text.length === 0) return;
    setSaved(false);
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      await diaryManager.saveDiary(getDateStr(currDate.current), text);
      setSaved(true);
    }, SAVE_DIARY_COOLDOWN);
  }

  // pause slide-in animation until new diary data is ready
  const proceedAnimation = async () => {
    console.log('animation', animationClass)
    switch (animationClass) {
      case 'left-out':
        setDiaryContent(
          getDateStr(currDate.current), await fetchedDiary.current);
        setAnimationClass('left-in');
        break;
      case 'left-in':
        setAnimationClass('');
        canSwitchDiary.current = true;  // animation finished
        break;
      case 'right-out':
        setDiaryContent(
          getDateStr(currDate.current), await fetchedDiary.current);
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
    fetchedDiary.current = diaryManager.fetchDiary(getDateStr(currDate.current))
    setAnimationClass('left-out');
    canSwitchDiary.current = false;  // lock
  }

  const toPrevDay = async () => {
    if (!canSwitchDiary.current) return;
    currDate.current.setDate(currDate.current.getDate() - 1);
    // stage newly fetched diary before render it to editor
    fetchedDiary.current = diaryManager.fetchDiary(getDateStr(currDate.current));
    setAnimationClass('right-out');
    canSwitchDiary.current = false;  // lock
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
    const dateStr = getDateStr(currDate.current);

    (async function () {
      const data = await diaryManager.fetchDiary(dateStr);
      fetchedDiary.current = data;
      setDiaryContent(dateStr, data);
    })();

  }, [userData, editor.current])


  return (
    <div className="relative pt-8 h-screen bg-gray-100">
      <div className="flex flex-col items-center overflow-hidden">

        <div>
          <LeftArrow className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2" onClick={toPrevDay} />
          <RightArrow className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2" onClick={toNextDay} />
        </div>

        <div className={`w-full md:max-w-2xl ${animationClass}`} onAnimationEnd={proceedAnimation}>
          <h1 className='text-4xl'>{getDateStr(currDate.current)}</h1>
          <div id="editor-container"></div>
          <div>{saved ? 'saved' : 'saving...'}</div>
        </div>

      </div>
    </div >
  )
}
