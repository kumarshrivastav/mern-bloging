import React, { useState, useEffect } from "react";
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiUser } from "react-icons/hi";
import {useDispatch} from "react-redux"
import { Link, useLocation ,useNavigate} from "react-router-dom";
import { signoutUserFailure, signoutUserStart, signoutUserSuccess } from "../redux/user/userSlice";
import { signout } from "../http/api.config";
const DashSideBar = () => {
  const location = useLocation();
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const [tab, setTab] = useState("");
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
        <Sidebar.ItemGroup>
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={"User"}
              labelColor="dark"
              as={"div"}
            >
              Profile
            </Sidebar.Item>
          </Link>
          <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer" onClick={handleSignOut}>
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSideBar;
