'use client'
import React, { useEffect } from 'react';
import Searchbar from '../components/WebChat/SearchBar/searchbar';
import FriendsList from '../components/WebChat/UserBar/FriendsList';
import LandingChat from '../components/WebChat/ChatSection/LandingChat';
const ChatsPage = () => {
  return (
    <>
      <div style={{display:"flex", margin:"0", padding:"0"}}>
      <div style={{display:"block", margin:"0", padding:"0"}}>
      <Searchbar/>
      <FriendsList/>
      </div>
      <LandingChat/>
      </div>
    </>
  );
};

export default ChatsPage;
