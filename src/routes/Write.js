import React from 'react'
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import "../components/easymde-override-style.css";

export default function Write() {

  return (
    <div className="pt-8">
      <div className="flex flex-col items-center">
        <SimpleMDE
          className="w-[21cm] h-[29.7cm]"
          options={{
            toolbar: false,
            spellChecker: false
          }} />
      </div>
    </div>
  )
}
