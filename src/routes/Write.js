import { React, useState } from 'react'
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import "./easymde-override-style.css";

const getDateStr = (date, delim) => {
  return (
    date.getFullYear() + delim +
    (date.getMonth() + 1) + delim +
    date.getDate()
  )
}

export default function Write() {

  const [dateStr, setDateStr] = useState(getDateStr(new Date(), '-'));

  return (
    <div className="pt-8 bg-gray-300">
      <div className="flex flex-col items-center">

        <SimpleMDE
          className="w-[21cm] h-[29.7cm]"
          value={'# ' + dateStr}
          options={{
            toolbar: false,
            spellChecker: false
          }} />

      </div>
    </div>
  )
}
