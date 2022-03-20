import React from 'react'
import { signInWithGooglePopup } from '../utils/firebase/firebase.utils'

export default function Login() {

  const signIn = async () => {
    const res = await signInWithGooglePopup();
    console.log(res);
  }

  return (
    <div className="m-auto">
      Login
      <button className="bg-blue-400" onClick={signIn}>Login</button>
    </div>
  )
}
