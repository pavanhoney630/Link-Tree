import React, { useState, useEffect } from "react";
import Sidebar from "./SideBar";
import Header from "./Header";
import styles from "../css/Settings.module.css";

const BASE_URL =
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_DEV_URL
      : import.meta.env.VITE_PROD_URL;

const Settings = () => {
  const [user, setUser] = useState({
    firstName: "Jenny",
    lastName: "Wilson",
    email: "JennyWilson08@gmail.com",
    password: "",
    confirmPassword: "",
  });

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token"); // Ensure you store JWT in localStorage
        if (!token) return;

        const response = await fetch(`${BASE_URL}/auth/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setUser({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: "", // Password should not be pre-filled for security
            confirmPassword: "",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [BASE_URL]);

  // Handle input change
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Unauthorized: Please log in.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/auth/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Profile updated successfully!");
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <Sidebar className={styles.settingsPageSidebar} />

      {/* Main Content Wrapper */}
      <div className={styles.mainContentWrapper}>
        {/* Header */}
        <Header className={styles.settingsPageHeader} />

        {/* Main Content */}
        <main className={styles.mainContent}>
          <div className={styles.profileSection}>
            <h3>Edit Profile</h3>
            <hr className={styles.divider} />  {/* Added HR tag */}

            <form className={styles.profileForm} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>First name</label>
                <input
                  type="text"
                  name="firstName"
                  value={user.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Last name</label>
                <input
                  type="text"
                  name="lastName"
                  value={user.lastName}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={user.password}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={user.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              {/* Save button aligned bottom-right */}
              <div className={styles.buttonContainer}>
               
              </div>
              <button type="submit" className={styles.saveButton}>Save</button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;