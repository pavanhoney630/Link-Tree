import React from "react";
import Sidebar from "./SideBar";
import Header from "./Header"
import styles from "../css/Analytics.module.css";

const Analytics = () => {
  return (
    <div className={styles.container}>
      <Sidebar  />
      <main className={styles.mainContent}>
      <Header/>
        {/* Add your Analytics content here */}
      </main>
    </div>
  );
};

export default Analytics;
