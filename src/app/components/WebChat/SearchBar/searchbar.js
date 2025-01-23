import React from 'react'
import { IoMdSearch } from 'react-icons/io'
import "./searchbar.css"
const Searchbar = () => {
  return (
    <div>
        <div className="search-bar">
        <h1>Chat</h1>
        <div className="input-box">
        <input type="text" placeholder="Search users..." />
            <span className="search-icon"><IoMdSearch/></span>
        </div>
      </div>
    </div>
  )
}

export default Searchbar