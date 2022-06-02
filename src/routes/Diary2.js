import React, { Component } from 'react'
import { Editor, EditorState, CompositeDecorator } from 'draft-js';
import DatePicker from 'react-datepicker';
import { AiOutlineRight, AiOutlineLeft, AiTwotonePlayCircle } from 'react-icons/ai'

import 'draft-js/dist/Draft.css';
import "react-datepicker/dist/react-datepicker.css";
import './override-styles.css';

import diaryManager from '../utils/diaryManager';
import { date2Str, offsetDate, isToday, date2IsoStr } from '../utils/common.utils';

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
  const tagRE = /#\S*/g  // hashtag followed by any non-space char
  let matchArr;  // [matchStr, index, input, groups]
  // regex objects keep an internal index to record where the next exec() should start from
  while ((matchArr = tagRE.exec(contentBlock.getText())) != null) {
    const start = matchArr.index;
    callback(start, start + matchArr[0].length)  // the index range to be highlighted
  }
}

class Diary2 extends Component {
  constructor(props) {
    super(props)
    const compositeDecorator = new CompositeDecorator([
      {
        strategy: tagStrategy,
        component: TagComponent
      }
    ])
    this.state = {
      editorState: EditorState.createEmpty(compositeDecorator),
      currDate: new Date(),
      displayedDate: new Date()
    }

    // 'this' in methods should refer to this class
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(editorState) {
    this.setState({ editorState })
  }

  render() {
    return (
      <div className='flex flex-col items-center'>
        <div className='w-full max-w-[21cm] px-4'>
          <div className='flex sm:justify-start justify-center items-center'>
            <AiOutlineLeft
              className='flex-shrink-0 text-gray-300 w-10 h-10 p-2 cursor-pointer rounded-full hover:bg-gray-100' />

            <div>
              <DatePicker
                selected={this.state.currDate}
                todayButton='Today'
                customInput={
                  <div className='flex justify-center items-center cursor-pointer 
                  w-56 text-center px-2 py-4 rounded-lg hover:bg-gray-100 text-4xl flex-shrink-0'>
                    {
                      isToday(this.state.displayedDate) ?
                        <AiTwotonePlayCircle size='10' className='text-clr-highlight mr-2' /> : null
                    }
                    <h1>{date2Str(this.state.displayedDate)}</h1>
                  </div>
                } />
            </div>

            <AiOutlineRight
              className='flex-shrink-0 text-gray-300 w-10 h-10 p-2 cursor-pointer rounded-full hover:bg-gray-100' />
          </div>

          <Editor
            editorState={this.state.editorState} onChange={this.handleChange} />
        </div>
      </div>
    );
  }
}

export default Diary2;