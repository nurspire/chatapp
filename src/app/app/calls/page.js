import React from 'react'
import LandingCall from '@/app/components/WebChat/CallSideBar/userLogSection/LandingCall'
import CallSidebar from '@/app/components/WebChat/CallSideBar/callSidebar/callsidebar'
import CallSearchbar from '@/app/components/WebChat/CallSideBar/callsrchbar/Callsearchbar'
const page = () => {
  return (
    <div style={{display:"flex", marginTop:"10px"}}>
       <div>
       <CallSearchbar/>
       <CallSidebar/>
       </div>
       <LandingCall/>
    </div>
  )
}

export default page