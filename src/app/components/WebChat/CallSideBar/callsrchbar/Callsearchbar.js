import React from "react";
import { IoMdCall } from "react-icons/io"; // Call icon
import "./searchbar.css";

const Searchbar = () => {
  return (
    <div className="UniqueSearchbar-container">
      <h1 style={{ marginTop: "20px" }}>Call</h1>
      <div className="UniqueSearchbar-inputBox">
        <input
          type="tel"
          placeholder="Search contacts..."
          className="UniqueSearchbar-input"
        />
        <span className="UniqueSearchbar-icon">
          <IoMdCall />
        </span>
      </div>
    </div>
  );
};

export default Searchbar;
