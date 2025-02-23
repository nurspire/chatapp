import React from 'react'
import UserCallLogSection from '@/app/components/WebChat/CallSideBar/userLogSection/UserLog'
import CallSidebar from '@/app/components/WebChat/CallSideBar/callSidebar/callsidebar'
import CallSearchbar from '@/app/components/WebChat/CallSideBar/callsrchbar/Callsearchbar'
const page = () => {
  return (
    <div style={{display:"flex", marginTop:"10px"}}>
       <div>
       <CallSearchbar/>
       <CallSidebar/>
       </div>
       <UserCallLogSection/>
    </div>
  )
}

export default page