import { React, useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import SideBar from './components/SideBar';
import History from './routes/History';
import Write from './routes/Write';
import Routine from './routes/Routine';
import Profile from './routes/Profile';
import { UserContext } from './contexts/user.context';

function App() {
  const { userData } = useContext(UserContext);

  return (
    <div className="font-montserrat bg-gray-100">
      <SideBar />
      <div className="pl-14">
        <Routes>
          <Route exact path="/" element={<Write />} />
          <Route path="/history" element={<History />} />
          <Route path="/routine" element={<Routine />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
