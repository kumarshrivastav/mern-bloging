import { Button } from "flowbite-react";
import React from "react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { oauth } from "../http/api.config";
import {useNavigate} from "react-router-dom"
import {useDispatch} from "react-redux"
import { signInFailure, signInStart, signInSuccess } from "../redux/user/userSlice";

const OAuth = () => {
    const navigate=useNavigate()
    const dispatch=useDispatch()
  const handleGoogleClick = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
        dispatch(signInStart)
      const resultFromGoogle = await signInWithPopup(auth, provider);
      console.log(resultFromGoogle);
      const { data } = await oauth({
        name: resultFromGoogle.user.displayName,
        email: resultFromGoogle.user.email,
        googlePhotoUrl: resultFromGoogle.user.photoURL,
      });
      dispatch(signInSuccess(data))
      return navigate("/")
    } catch (error) {
        dispatch(signInFailure(error.response.data.message))
      console.log(error);
    }
  };
  return (
    <Button
      type="button"
      gradientDuoTone="pinkToOrange"
      outline
      onClick={handleGoogleClick}
    >
      <AiFillGoogleCircle className="w-6 h-6" />
      Continue with Google
    </Button>
  );
};

export default OAuth;
