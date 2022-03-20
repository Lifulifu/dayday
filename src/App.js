import React from 'react';
import { Route, Routes } from 'react-router-dom';

import History from './routes/History';
import Write from './routes/Write';
import Routine from './routes/Routine';
import Login from './routes/Login';

import SideBar from './components/SideBar';

function App() {
  return (
    <div className="font-montserrat">
      <SideBar />
      <div className="pl-14">
        <Routes>
          <Route exact path="/write" element={<Write />} />
          <Route path="/history" element={<History />} />
          <Route path="/routine" element={<Routine />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
