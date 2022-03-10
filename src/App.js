import React from 'react';
import { Route, Routes } from 'react-router-dom';

import History from './routes/History';
import Write from './routes/Write';
import Routine from './routes/Routine';
import SideBar from './components/SideBar';

function App() {
  return (
    <>
      <SideBar/>
      <Routes>
        <Route exact path="/Write" element={ <Write/> }/>
        <Route path="/History" element={ <History/> }/>
        <Route path="/Routine" element={ <Routine/> }/>
      </Routes>
    </>
  );
}

export default App;
