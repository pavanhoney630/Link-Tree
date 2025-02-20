import React, { useState } from 'react';
import styles from '../css/UserSelection.module.css';
import SparkImg from '../assets/SparkImg.png'; // Update the path to your Spark logo
import SignupImage from '../assets/SignupImage.png'; // Update the path to your Signup image

const UserSelection = () => {
    const [username, setUsername] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const handleContinue = (e) => {
        e.preventDefault();
        // Store username and selected category in local storage
        localStorage.setItem('username', username);
        localStorage.setItem('selectedCategory', selectedCategory);
        // Redirect or perform further actions as needed
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
