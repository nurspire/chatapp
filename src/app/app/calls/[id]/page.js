import React from 'react'
import UserLogSection from '@/app/components/WebChat/CallSideBar/userLogSection/page'
import CallSidebar from '@/app/components/WebChat/CallSideBar/callSidebar/callsidebar'
import CallSearchbar from '@/app/components/WebChat/CallSideBar/callsrchbar/Callsearchbar'
const page = () => {
  return (
    <div style={{display:"flex", marginTop:"10px"}}>
       <div>
       <CallSearchbar/>
       <CallSidebar/>
       </div>
       <UserLogSection/>
    </div>
  )
}

export default page