import React, { Component } from 'react'
import { Editor, EditorState, CompositeDecorator } from 'draft-js';
import 'draft-js/dist/Draft.css';
import './override-styles.css';

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
    callback(start, start + matchArr[0].length);  // the index range to be highlighted
  }
}

class Diary2 extends Component {
  constructor(props) {
    super(props);
    const compositeDecorator = new CompositeDecorator([
      {
        strategy: tagStrategy,
        component: TagComponent
      }
    ]);
    this.state = {
      editorState: EditorState.createEmpty(compositeDecorator)
    };
  }

  handleChange(editorState) {
    this.setState({ editorState });
  }

  render() {
    return (
      <div className='w-full flex flex-col items-center'>
        <div className='w-full max-w-[40em] min-h-[300px] px-4'>
          <Editor
            editorState={this.state.editorState} onChange={this.handleChange} />
        </div>
      </div>
    );
  }
}

export default Diary2;