import React, { useState } from 'react';
import axios from 'axios';
import styles from '../css/Login.module.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import SparkImg from "../assets/SparkImg.png";  // Ensure correct path and file extension
import LoginImage from "../assets/SignupImage.png";   // Ensure correct path and file extension

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/auth/login', {
        username,
        password,
      });
      console.log(response.data);
      // Handle successful login (e.g., store token, redirect)
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.leftSection}>
        <img src={SparkImg} alt="Spark" className={styles.sparkImage} />
      </div>
      <div className={styles.middleSection}>
        <h1>Sign in to your Spark</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Spark/Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.inputField}
          />
          <div className={styles.passwordContainer}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.inputField}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className={styles.eyeIcon}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button type="submit" className={styles.loginButton}>Log in</button>
        </form>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <a href="/forgot-password" className={styles.link}>Forgot password?</a>
        <p>Don't have an account? <a href="/signup" className={styles.link}>Sign up</a></p>
      </div>
      <div className={styles.rightSection}>
        <img src={LoginImage} alt="Login" className={styles.loginImage} />
      </div>
    </div>
  );
};

export default Login;
