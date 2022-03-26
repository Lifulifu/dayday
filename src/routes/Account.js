import { React, useContext } from 'react'
import SquareButton from '../assets/SquareButton'
import { FcGoogle } from 'react-icons/fc'

import { logInWithGooglePopup, logOut } from '../utils/firebase.utils'
import { UserContext } from '../contexts/user.context'

export default function Account() {
  const { userData } = useContext(UserContext);

  if (!userData)
    return null;

  return (
    <div className="flex flex-col items-center mt-24">
      <img src={userData.user.photoURL} alt="user photo" className="rounded-full" />
      <h1 className="text-2xl mt-4">{userData.user.displayName}</h1>
      <SquareButton className="mt-24" onClick={logOut}>
        Log out
      </SquareButton>
    </div>
  )
}
