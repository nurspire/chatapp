'use client'
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import Next.js router for navigation
// import ChatNavbar from '@/app/components/WebChat/ChatFilter/FilterSec';
import Searchbar from '@/app/components/WebChat/SearchBar/searchbar'
import FriendsList from '@/app/components/WebChat/UserBar/FriendsList';
import ChatSection from '@/app/components/WebChat/ChatSection/Chatsec';
const ChatsPage = () => {
  return (
    <>
      <div style={{ display: "flex"}}>
        <div style={{ display: "block" }}>
          <Searchbar />
          <FriendsList />
        </div>
        <div className="">
          <ChatSection />
        </div>
      </div>
    </>
  );
};

export default ChatsPage;
