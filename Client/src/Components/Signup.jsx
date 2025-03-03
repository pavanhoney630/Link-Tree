import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import styles from "../css/Signup.module.css";
import SparkImg from "../assets/SparkImg.png";
import SignupImage from "../assets/SignupImage.png";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Ensure correct import for styles

const BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_DEV_URL
    : import.meta.env.VITE_PROD_URL;

const Signup = () => {
  const navigate = useNavigate(); // Initialize navigation
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.firstName) newErrors.firstName = "First name required*";
    if (!formData.lastName) newErrors.lastName = "Last name required*";
    if (!formData.email) {
      newErrors.email = "Email required*";
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = "Invalid email format*";
    }
    if (!formData.password) {
      newErrors.password = "Password required*";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters*";
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password = "Must contain at least one lowercase letter*";
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = "Must contain at least one uppercase letter*";
    } else if (!/(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Must contain at least one number*";
    } else if (!/(?=.*[!@#$%^&*])/.test(formData.password)) {
      newErrors.password = "Must contain at least one special character*";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match*";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    if (!validateForm()) return;

    try {
      const response = await axios.post(`${BASE_URL}/auth/signup`, formData);

      // Extract the temp token from the response
      const { message, token, id } = response.data;

      // Store temp token & user ID in localStorage
      localStorage.setItem("tempToken", token);
      localStorage.setItem("userId", id);

      toast.success(message, { position: "top-right" }); // Green toast

      setTimeout(() => navigate("/user"), 2000); // Redirect after 2s
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Something went wrong";
      setErrors({ general: errorMsg });
      toast.error(errorMsg, { position: "top-right" }); // Red toast
    }
};


  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <img src={SparkImg} alt="Spark Logo" className={styles.logo} />
      </div>
      <div className={styles.middleSection}>
        <h1 className={styles.title}>Sign up to your Spark</h1>
        <div className={styles.accountCreation}>
          <h3>Create an account</h3>
          <p className={styles.signInLink}><a href="/login">Sign in instead</a></p>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          {errors.firstName && <p className={styles.error}>{errors.firstName}</p>}
          
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && <p className={styles.error}>{errors.lastName}</p>}
          
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}
          
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p className={styles.error}>{errors.password}</p>}
          
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword}</p>}
          
          <div className={styles.terms}>
            <div><input type="checkbox" required /></div>
            <div><span> By creating an account, I agree to the <a href="#">Terms of use</a> and <a href="#">Privacy Policy</a></span></div>
          </div>
          
          {errors.general && <p className={styles.error}>{errors.general}</p>}
          
          <button type="submit" className={styles.submitBtn}>Create an account</button>
        </form>
      </div>
      
      <div className={styles.rightSection}>
        <img src={SignupImage} alt="Signup Visual" className={styles.signupImg} />
      </div>

      {/* Toast container for notifications */}
      <ToastContainer />
    </div>
  );
};

export default Signup;
