import { React, useContext } from 'react'
import { logInWithGooglePopup, logOut } from '../utils/firebase.utils'

import SquareButton from '../components/SquareButton'
import { UserContext } from '../contexts/user.context'

export default function Profile() {
  const { userData } = useContext(UserContext);

  const handleLogInClick = async () => {
    await logInWithGooglePopup();
  }

  const handleLogOutClick = async () => {
    await logOut();
  }

  return (
    <div className="flex justify-center">
      {
        userData ? (
          <SquareButton className="mt-48" onClick={handleLogOutClick}>
            Log out
          </SquareButton>
        ) : (
          <SquareButton className="mt-48" onClick={handleLogInClick}>
            Log in with Google
          </SquareButton>
        )
      }
    </div>
  )
}
