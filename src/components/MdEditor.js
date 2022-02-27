import React, { useEffect } from 'react'
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

export default function MdEditor() {
  
  return (
    <div className="w-full h-full ml-14">
      <SimpleMDE/>
    </div>
  )
}
