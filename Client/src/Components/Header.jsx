import React from "react";
import styles from "../css/Header.module.css";

function Header({ className }) { // Destructure className from props
  const username = localStorage.getItem("username") || "User"; // Get from localStorage

  return (
    <header className={`${styles.header} ${className}`}> {/* Apply both default and passed className */}
      <h2>Hi, <span>{username}!</span></h2>
      <p>Congratulations! You got a great response today.</p>
    </header>
  );
}

export default Header;