import { React, useState, useRef, useEffect, useContext } from 'react'
import { useTransition } from 'react-transition-state';
import { useParams } from 'react-router-dom';

import { Editor, EditorState, ContentState, CompositeDecorator } from 'draft-js';
import 'draft-js/dist/Draft.css';
import "react-datepicker/dist/react-datepicker.css";
import './override-styles.css';

import TopBar from '../components/TopBar';
import ContentContainer from '../components/ContentContainer';
import DatePicker from 'react-datepicker';
import {
  AiOutlineRight,
  AiOutlineLeft,
  AiTwotonePlayCircle,
  AiOutlineCheckCircle
} from 'react-icons/ai'

import { UserContext } from '../contexts/user.context';
import { diaryManager } from '../utils/diaryManager';
import { date2Str, offsetDate, isToday, str2Date, isDateStrValid } from '../utils/common.utils';
import TopBarItem from '../components/TopBarItem';

const TagComponent = (props) => {
  return (
    <span
      className='text-clr-highlight text-2xl font-bold cursor-pointer hover:underline'
      onClick={() => console.log(props.decoratedText)}>
      {props.children}
    </span>
  )
}

// tag detection
const tagStrategy = (contentBlock, callback, contentState) => {
  const tagRE = /#[^#\s]*/g  // hashtag followed by any non-space, non-tag char 
  let matchArr;  // [matchStr, index, input, groups]
  // regex objects keep an internal index to record where the next exec() should start from
  while ((matchArr = tagRE.exec(contentBlock.getText())) != null) {
    const start = matchArr.index;
    callback(start, start + matchArr[0].length)  // the index range to be highlighted
  }
}

const compositeDecorator = new CompositeDecorator([
  {
    strategy: tagStrategy,
    component: TagComponent
  }
])

function IsSaved({ isSaved }) {
  if (isSaved) return (
    <TopBarItem className="flex flex-row items-center">
      <AiOutlineCheckCircle className='flex-shrink-0 mr-1' />
      <span>saved</span>
    </TopBarItem>
  )
  else return (
    <TopBarItem>
      saving...
    </TopBarItem>
  )
}

export default function Diary() {

  const { userData } = useContext(UserContext);
  const { dateParam } = useParams();

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(compositeDecorator));
  const diaryBuf = useRef(null);
  const [currDate, setCurrDate] = useState(new Date());
  const currDateBuf = useRef(new Date());
  const [editorShowState, toggleEditorShow] = useTransition({ timeout: 300, preEnter: true });
  const [isSaved, setIsSaved] = useState(true);

  const setEditorText = (text) => {
    setEditorState(EditorState.createWithContent(
      ContentState.createFromText(text),
      compositeDecorator
    ))
  }

  const getEditorText = (_editorState) => _editorState.getCurrentContent().getPlainText()

  // set content or just title if content is empty
  const displayDiaryContent = (date, data) => {
    console.log('display diary', date2Str(date), data)
    setCurrDate(date);
    if (data) {
      setEditorText(data.content);
    }
    else {
      setEditorText('');
    }
  }

  // on mounted
  useEffect(() => {
    console.log('param', dateParam)
    toggleEditorShow(true);
  }, []);

  // on current date change
  useEffect(() => {
    console.log('userData changed')
    diaryManager.userData = userData;
    diaryManager.setIsSaved = setIsSaved;

    // fetch and render new diary
    if (!userData) return;
    if (dateParam === 'today')
      triggerDiarySwitch(currDate);
    else {
      if (isDateStrValid(dateParam))
        triggerDiarySwitch(str2Date(dateParam))
    }
  }, [userData])

  const triggerDiarySwitch = (newDate) => {
    toggleEditorShow(false)
    currDateBuf.current = newDate;
    diaryBuf.current = diaryManager.fetchDiary(newDate)
  }

  const changeDate = async (newDate) => {
    diaryManager.triggerSave(currDate, getEditorText(editorState), true) // force save (ignore cooldown)
    triggerDiarySwitch(newDate)
  }

  useEffect(() => {
    if (editorShowState !== 'exited' || !diaryBuf.current)
      return;
    diaryBuf.current.then((newDiary) => {
      displayDiaryContent(currDateBuf.current, newDiary)
      toggleEditorShow(true)
    })
  }, [editorShowState])


  // on editor change
  const handleEditorChange = (_editorState) => {
    if (!diaryManager.userData) return;
    setEditorState(_editorState)
    setIsSaved(false)
    diaryManager.triggerSave(currDate, getEditorText(_editorState))
  }

  return (
    <>
      <TopBar className='z-20'
        rightChildren={
          <>
            <IsSaved isSaved={isSaved} />
            <TopBarItem>{date2Str(currDate)}</TopBarItem>
          </>
        }
      />

      <ContentContainer>
        <div className={`${editorShowState} editor`}>
          <div className='relative z-10 flex sm:justify-start justify-center items-center'>
            <AiOutlineLeft onClick={() => changeDate(offsetDate(currDate, -1))}
              className='flex-shrink-0 text-gray-300 w-10 h-10 p-2 cursor-pointer rounded-full hover:bg-gray-100' />

            <div>
              <DatePicker
                onChange={(date) => changeDate(date)}
                selected={currDate}
                todayButton='Today'
                customInput={
                  <div className='flex justify-center items-center cursor-pointer 
                    w-56 text-center px-2 py-4 rounded-lg hover:bg-gray-100 flex-shrink-0'>
                    {
                      isToday(currDate) ?
                        <AiTwotonePlayCircle size='10' className='text-clr-highlight mr-2' /> : null
                    }
                    <h1 className='text-4xl'>{date2Str(currDate)}</h1>
                  </div>
                } />
            </div>

            <AiOutlineRight onClick={() => changeDate(offsetDate(currDate, 1))}
              className='flex-shrink-0 text-gray-300 w-10 h-10 p-2 cursor-pointer rounded-full hover:bg-gray-100' />
          </div>

          <Editor
            editorState={editorState} onChange={handleEditorChange} />
        </div>

      </ContentContainer>
    </>
  )
}
