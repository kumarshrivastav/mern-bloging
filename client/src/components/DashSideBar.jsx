import React, { useState, useEffect } from "react";
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiDocumentText, HiUser } from "react-icons/hi";
import {useDispatch,useSelector} from "react-redux"
import { Link, useLocation ,useNavigate} from "react-router-dom";
import { signoutUserFailure, signoutUserStart, signoutUserSuccess } from "../redux/user/userSlice";
import { signout } from "../http/api.config";
const DashSideBar = () => {
  const location = useLocation();
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const [tab, setTab] = useState("");
  const {currentUser} =useSelector(state=>state.user)
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    tabFromUrl && setTab(tabFromUrl);
    console.log(tabFromUrl);
  }, [location.search]);
  const handleSignOut=async()=>{
    try {
      dispatch(signoutUserStart())
      await signout();
      navigate("/sign-in")
      return dispatch(signoutUserSuccess())
    } catch (error) {
      dispatch(signoutUserFailure(error.response.data.message))
      console.log(error.response.data.message)
    }
  }
  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser.isAdmin ? "Admin":"User"}
              labelColor="dark"
              as={"div"}
            >
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=posts">
            <Sidebar.Item active={tab==='posts'} icon={HiDocumentText} as='div'>
              Posts
            </Sidebar.Item>
            </Link>
          )}
          <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer" onClick={handleSignOut}>
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSideBar;
