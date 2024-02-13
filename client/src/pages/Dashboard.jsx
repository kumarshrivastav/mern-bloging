import React, { useEffect, useState } from 'react'
import {useLocation} from "react-router-dom"
import DashSideBar from '../components/DashSideBar.jsx'
import DashProfile from '../components/DashProfile.jsx'
import DashPosts from '../components/DashPosts.jsx'
import DashUsers from '../components/DashUsers.jsx'
import DashComment from '../components/DashComment.jsx'
import DashboardComp from '../components/DashboardComp.jsx'
const Dashboard = () => {
  const location=useLocation()
  const [tab,setTab]=useState('')
  useEffect(()=>{
    const urlParams=new URLSearchParams(location.search)
    const tabFromUrl=urlParams.get('tab')
    tabFromUrl && setTab(tabFromUrl)
    console.log(tabFromUrl)
  },[location.search])
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        {/* sidebar */}
        <DashSideBar/>
      </div>
      {/* profile */}
      {tab==='profile' && <DashProfile/>}
      {/* posts */}
      {tab==='posts' && <DashPosts/>}
      {/* users */}
      {tab==='users' && <DashUsers/>}
      {/* comments */}
      {tab==='comments' && <DashComment/>}
      {/* dashboard component */}
      {tab==='dash' && <DashboardComp/>}
    </div>
  )
}

export default Dashboard
