import { React, useContext, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

import SideBar from './components/SideBar';
import Diary from './routes/Diary';
import Search from './routes/Search';
import Profile from './routes/Profile';
import Tags from './routes/Tags';
import Collection from './routes/Collection';
import Modal from './components/Modal';
import SquareButton from './components/SquareButton';

import { UserContext } from './contexts/user.context';
import { logInWithGooglePopup, logOut } from './utils/firebase.utils'
import { date2IsoStr, date2Str } from './utils/common.utils';

function App() {
  const { userData } = useContext(UserContext);

  useEffect(() => {
    document.title = 'DayDay';
  }, [])


  return (
    <div className="font-montserrat">

      <Modal isOpen={!userData} canClose={false} className="z-50">
        <h1 className="mb-8 text-xl">Please Log In</h1>
        <SquareButton className='flex items-center' onClick={logInWithGooglePopup}>
          <FcGoogle className="mr-2" />
          <span>Log in with Google</span>
        </SquareButton>
      </Modal>

      <SideBar className="fixed z-40" />

      <div className="relative sm:ml-14 z-30">
        <Routes>
          <Route path="/diary/:dateParam" element={<Diary />} />
          <Route path="/" exact element={<Navigate to={`/diary/${date2Str(new Date())}`} replace />} />
          <Route path="/tags" element={<Tags />} />
          <Route path="/tags/collection/:tagName" element={<Collection />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
