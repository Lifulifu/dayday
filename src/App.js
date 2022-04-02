import { React, useContext, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

import SideBar from './components/SideBar';
import History from './routes/History';
import Write from './routes/Write';
import Routine from './routes/Routine';
import Account from './routes/Account';
import Modal from './assets/Modal';
import SquareButton from './assets/SquareButton';

import { UserContext } from './contexts/user.context';
import { logInWithGooglePopup, logOut } from './utils/firebase.utils'

function App() {
  const { userData } = useContext(UserContext);

  return (
    <div className="font-montserrat">

      <Modal isOpen={!userData} canClose={false} className="z-50">
        <h1 className="mb-8 text-xl">Please Log In</h1>
        <SquareButton className='flex items-center' onClick={logInWithGooglePopup}>
          <FcGoogle className="mr-2" />
          <span>Log in with Google</span>
        </SquareButton>
      </Modal>

      <SideBar className="z-40" />

      <div className="reletive pl-14 z-30">
        <Routes>
          <Route exact path="/" element={<Write />} />
          <Route path="/history" element={<History />} />
          <Route path="/routine" element={<Routine />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
