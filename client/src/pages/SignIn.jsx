import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Label, TextInput, Button, Alert, Spinner } from "flowbite-react";
import { signin } from "../http/api.config";
import {useDispatch,useSelector} from "react-redux"
import { signInFailure, signInStart, signInSuccess } from "../redux/user/userSlice";
const SignIn = () => {
  const dispatch=useDispatch()
  const [formData, setFormData] = useState({
    password: "",
    email: "",
  });
  // console.log(formData);
  const {loading:isLoading,error:errorMessage}=useSelector((state)=>state.user)
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.password || !formData.email) {
      return dispatch(signInFailure("please fill out all fields"));
    }
    try {
      dispatch(signInStart())
      const { data } = await signin(formData)
      console.log(data);
      dispatch(signInSuccess(data))
      setFormData({password: "", email: "" });
      alert("User Login Successfully");
      return navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.response.data.message))
    }
  };
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              MernStack
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima
            dolorem, aliquam eum sequi sint exercitationem delectus alias
            accusamus dolores officiis quia quos et iste perferendis!
          </p>
        </div>
        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
              <Label value="Your email" />
              <TextInput
                type="email"
                placeholder="name@gmail.com"
                id="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [e.target.id]: e.target.value.trim(),
                  })
                }
              />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput
                type="password"
                placeholder="********"
                id="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [e.target.id]: e.target.value.trim(),
                  })
                }
              />
            </div>
            
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Don't Have an account?</span>
            <Link to="/sign-up" className="text-blue-500">
              Sign Up
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
