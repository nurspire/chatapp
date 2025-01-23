import React from 'react';
import { IoMdCall } from 'react-icons/io'; // Changed icon to call icon
import "./searchbar.css";

const Searchbar = () => {
  return (
    <div>
        <div className="search-bar">
        <h1 style={{marginTop:"20px"}}>Call</h1>
        <div className="input-box">
        <input type="tel" placeholder="Search contacts..." /> {/* Changed input type to 'tel' */}
            <span className="search-icon"><IoMdCall /></span> {/* Changed icon to phone */}
        </div>
      </div>
    </div>
  );
}

export default Searchbar;
