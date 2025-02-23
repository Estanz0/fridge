import React from "react";
import { Link } from "react-router-dom";
import { account } from "../util/Appwrite";
import "./Logout.css"; // Import the CSS file

function Logout() {
  const logoutUser = async () => {
    try {
      const response = await account.deleteSession("current");

      console.log("Logout successful:", response);
      // Redirect to index
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
      // Handle logout errors appropriately
    }
  };

  return (
    <div className="logout-container">
      <h2 className="logout-message">Are you sure you want to log out?</h2>
      <div className="logout-options">
        <p>
          <Link to="/" className="header-link">
            No, I don't
          </Link>
        </p>

        <p>
          <button className="logout-button" onClick={logoutUser}>
            Yes, I'm sure
          </button>
        </p>
      </div>
    </div>
  );
}

export default Logout;
