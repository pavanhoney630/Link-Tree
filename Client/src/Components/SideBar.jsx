import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import SparkImg from "../assets/SparkImg.png";
import styles from "../css/SideBar.module.css";
import settings from "../assets/settings.png";
import Appearence from "../assets/Appearence.png";
import Analytics from "../assets/Analytics.png";
import Links from "../assets/Links.png";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_DEV_URL
    : import.meta.env.VITE_PROD_URL;

const Sidebar = () => {
  // Get username and profile image directly from localStorage
  const [userData, setUserData] = useState({
    username: localStorage.getItem("username") || "Guest",
  
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
  
      try {
        const response = await axios.get(`${BASE_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        console.log("Sidebar API response:", response.data);
  
        const profile = response.data?.profile || {};
  
        // Ensure we're setting the latest image directly
        setUserData({
          username: profile.profileTitle || "Guest",
          profileImage: profile.profileImage || "",
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
  
    fetchUserProfile();
  }, [BASE_URL]);
  
  
  
  
  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <img src={SparkImg} alt="Spark Logo" className={styles.logo} />

      {/* Navigation */}
      <nav>
        <ul>
        <li>
  <NavLink to="/links" className={({ isActive }) => (isActive ? styles.active : "")}>
    <img src={Links} className={styles.sidelogo} alt="Links Icon" />
    Links
  </NavLink>
</li>
<li>
  <NavLink to="/appearance" className={({ isActive }) => (isActive ? styles.active : "")}>
    <img src={Appearence} className={styles.sidelogo} alt="Appearance Icon" />
    Appearance
  </NavLink>
</li>
<li>
  <NavLink to="/analytics" className={({ isActive }) => (isActive ? styles.active : "")}>
    <img src={Analytics} className={styles.sidelogo} alt="Analytics Icon" />
    Analytics
  </NavLink>
</li>
<li>
  <NavLink to="/settings" className={({ isActive }) => (isActive ? styles.active : "")}>
    <img src={settings} className={styles.sidelogo} alt="Settings Icon" />
    Settings
  </NavLink>
</li>
        </ul>
      </nav>

      {/* Profile Section */}
      <div className={styles.userProfile}>
      <img
  src={userData.profileImage}
  alt="Profile"
  onError={(e) => {
    console.error("Image failed to load:", e.target.src);
    e.target.style.display = "";
  }}
  className={styles.profileImage}
/>

        <span className={styles.profileName}>{userData.username}</span>
      </div>
    </aside>
  );
};

export default Sidebar;
