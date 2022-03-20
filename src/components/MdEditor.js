import React from 'react'
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import "./easymde-override-style.css";

export default function MdEditor({ title }) {
  return (
    <div className="flex flex-col items-center">
      <SimpleMDE
        className="w-[21cm] h-[29.7cm]"
        value={title}
        options={{
          toolbar: false,
          spellChecker: false
        }} />
    </div>
  )
}
