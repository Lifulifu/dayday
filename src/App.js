import { React } from 'react';
import { Route, Routes } from 'react-router-dom';

import SideBar from './components/SideBar';
import History from './routes/History';
import Write from './routes/Write';
import Routine from './routes/Routine';
import Profile from './routes/Profile';

function App() {
  return (
    <div className="font-montserrat">
      <SideBar />
      <div className="pl-14">
        <Routes>
          <Route exact path="/write" element={<Write />} />
          <Route path="/history" element={<History />} />
          <Route path="/routine" element={<Routine />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
