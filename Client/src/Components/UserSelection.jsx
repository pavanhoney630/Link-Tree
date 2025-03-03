import React, { useState } from 'react';
import styles from '../css/UserSelection.module.css';
import SparkImg from '../assets/SparkImg.png'; // Update the path to your Spark logo
import SignupImage from '../assets/SignupImage.png'; // Update the path to your Signup image
import { useNavigate } from "react-router-dom"; // Import useNavigate

const BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_DEV_URL
    : import.meta.env.VITE_PROD_URL;

const UserSelection = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const handleContinue = async (e) => {
        e.preventDefault();
    
        // Get tempToken from localStorage
        const tempToken = localStorage.getItem("tempToken");
    
        if (!tempToken) {
            console.error("No temp token found. Please sign up first.");
            return;
        }
    
        localStorage.setItem("username", username);
        localStorage.setItem("selectedCategory", selectedCategory);
    
        try {
            const response = await fetch(`${BASE_URL}/auth/username`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tempToken}`, // Send token in headers
                },
                body: JSON.stringify({ username }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                console.log(data.message); // Log success response
    
                // Store the main token (if provided)
                if (data.token) {
                    localStorage.setItem("token", data.token);
                }
                navigate('/login')
            } else {
                console.error("Failed to set username:", data.message);
            }
        } catch (error) {
            console.error("Error storing username:", error);
        }
    };
    
    return (
        <div className={styles.userSelectionContainer}>
        <div className={styles.leftSection}>
            <img src={SparkImg} alt="SPARK" className={styles.logo} />
        </div>
    
        <div className={styles.middleSection}>
            <h1>Tell us about yourself</h1>
            <p>For a personalized Spark experience</p>
            <input 
                type="text" 
                placeholder="Tell us your username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
            />
            <div className={styles.categories}>
                <p>Select one category that best describes your profile</p>
                <div className={styles.categoryButtons}>
                    {['Business', 'Creative', 'Education', 'Entertainment', 'Fashion & Beauty', 'Food & Beverage', 'Government & Politics', 'Health & Wellness', 'Non-Profit', 'Other', 'Tech', 'Travel & Tourism'].map((category) => (
                        <button 
                            key={category} 
                            className={`${styles.categoryButton} ${selectedCategory === category ? styles.selected : ''}`} 
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>
            <button className={styles.continueButton} onClick={handleContinue}>Continue</button>
        </div>
    
        <div className={styles.rightSection}>
            <img src={SignupImage} alt="Signup" className={styles.signupImg} />
        </div>
    </div>
      );
};

export default UserSelection;
