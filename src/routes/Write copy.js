import { React, useState, useRef, useEffect, useContext } from 'react'

import EasyMDE from "easymde";
import "easymde/dist/easymde.min.css";
import "./easymde-override-style.css";
import "react-datepicker/dist/react-datepicker.css";

// import DaydayDatePicker from '../components/DaydayDatePicker';
import DatePicker from 'react-datepicker';
import { AiOutlineRight, AiOutlineLeft, AiTwotonePlayCircle } from 'react-icons/ai'

import { UserContext } from '../contexts/user.context';
import { DiaryManager } from '../utils/diaryManager';
import { date2Str, offsetDate, isToday } from '../utils/common.utils';

import React, { Component } from 'react'

export default class Write extends Component {
  constructor() {

  }

  render() {
    return (
      <>
        <div className="relative pt-16 h-screen overflow-x-hidden">
          <div className="flex flex-col items-center overflow-hidden">

            <div className={`w-full md:max-w-2xl -z-0 ${animationClass}`}
              onAnimationEnd={editorFadeOutAnimationEndHandler}>
              <div className='flex flex-start items-center'>
                <AiOutlineLeft onClick={() => setCurrDate(offsetDate(currDate, -1))}
                  className='text-gray-300 w-10 h-10 p-2 cursor-pointer rounded-full hover:bg-gray-100' />
                <div>
                  <DatePicker
                    onChange={(date) => setCurrDate(date)}
                    selected={currDate}
                    customInput={
                      <div className='flex justify-center items-center cursor-pointer 
                    w-56 text-center p-4 rounded-lg hover:bg-gray-100 text-4xl flex-shrink-0'>
                        {
                          isToday(displayedDate) ?
                            <AiTwotonePlayCircle size='10' className='text-clr-highlight mr-2' /> : null
                        }
                        <h1>{date2Str(displayedDate)}</h1>
                      </div>
                    } />
                </div>
                <AiOutlineRight onClick={() => setCurrDate(offsetDate(currDate, 1))}
                  className='text-gray-300 w-10 h-10 p-2 cursor-pointer rounded-full hover:bg-gray-100' />
              </div>

              <div id="editor-container"></div>
              <div>{saved ? 'saved' : 'saving...'}</div>

            </div>

          </div>
        </div >
      </>
    )

  }
}



const SAVE_DIARY_COOLDOWN = 1000;

export default function Write() {

  const { userData } = useContext(UserContext);

  const fetchedDiary = useRef(null);  // stage newly fetched diary before render it to editor
  const editor = useRef(null);
  const canSwitchDiary = useRef(true);  // debounce switching diary

  const [currDate, setCurrDate] = useState(new Date());
  const [displayedDate, setDisplayedDate] = useState(new Date());  // will align with currDate when diary is fetched
  const [diaryManager, setDiaryManager] = useState(new DiaryManager());
  const [animationClass, setAnimationClass] = useState('');
  const [saved, setSaved] = useState(true);

  // set content or just title if content is empty
  const displayDiaryContent = (date, data) => {
    console.log('display diary', date2Str(date), data)
    setDisplayedDate(date);
    if (data) {
      editor.current.value(data.content);
    }
    else {
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
      await diaryManager.saveDiary(currDate, text);
      setSaved(true);
    }, SAVE_DIARY_COOLDOWN);
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
  useEffect(async () => {
    console.log('user state changed', userData);
    if (!userData || !editor.current) return;

    // add eventlistener here because the handler depends on userData
    const onChangeHandler = (cm, delta) => {
      triggerAutoSave(cm.getValue());
    }
    editor.current.codemirror.on('change', onChangeHandler);

    // fetch today's diary and display to editor
    diaryManager.setUser(userData.userDocRef);
    const data = await diaryManager.fetchDiary(currDate);
    fetchedDiary.current = data;
    displayDiaryContent(currDate, data);
    canSave.current = true;

    return () => {
      editor.current.codemirror.off('change', onChangeHandler);
    }
  }, [userData, editor.current])

  // on current date change
  useEffect(() => {
    console.log('curr date changed', date2Str(currDate))
    if (!canSwitchDiary || !userData || !editor.current) return;
    canSwitchDiary.current = false;
    fetchedDiary.current = diaryManager.fetchDiary(currDate);
    setAnimationClass('fade-out');
  }, [currDate])

  // on editor faded out
  const editorFadeOutAnimationEndHandler = async (e) => {
    if (e.animationName !== 'fade-out') return;
    const data = await fetchedDiary.current;  // wait until diary is fetched
    displayDiaryContent(currDate, data);
    setAnimationClass('fade-in');
    canSwitchDiary.current = true;
  }

  return (
    <>
      <div className="relative pt-16 h-screen overflow-x-hidden">
        <div className="flex flex-col items-center overflow-hidden">

          <div className={`w-full md:max-w-2xl -z-0 ${animationClass}`}
            onAnimationEnd={editorFadeOutAnimationEndHandler}>
            <div className='flex flex-start items-center'>
              <AiOutlineLeft onClick={() => setCurrDate(offsetDate(currDate, -1))}
                className='text-gray-300 w-10 h-10 p-2 cursor-pointer rounded-full hover:bg-gray-100' />
              <div>
                <DatePicker
                  onChange={(date) => setCurrDate(date)}
                  selected={currDate}
                  customInput={
                    <div className='flex justify-center items-center cursor-pointer 
                    w-56 text-center p-4 rounded-lg hover:bg-gray-100 text-4xl flex-shrink-0'>
                      {
                        isToday(displayedDate) ?
                          <AiTwotonePlayCircle size='10' className='text-clr-highlight mr-2' /> : null
                      }
                      <h1>{date2Str(displayedDate)}</h1>
                    </div>
                  } />
              </div>
              <AiOutlineRight onClick={() => setCurrDate(offsetDate(currDate, 1))}
                className='text-gray-300 w-10 h-10 p-2 cursor-pointer rounded-full hover:bg-gray-100' />
            </div>

            <div id="editor-container"></div>
            <div>{saved ? 'saved' : 'saving...'}</div>

          </div>

        </div>
      </div >
    </>
  )
}
