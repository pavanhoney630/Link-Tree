import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "../css/SharedPage.module.css";
import BSparkImg from "../assets/BSparkImg.png";
import LinkList from "../../Render/LinkList";
import ShopList from "../../Render/ShopList";

const SharedPage = () => {
  const { profileId } = useParams(); // Extract profileId from the URL
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/shared/${profileId}`);
        setProfile(response.data.profileData);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [profileId]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.sharedContainer}>
      <div className={styles.sharedPreview}>
        <div
          className={styles.previewHeader}
          style={{ backgroundColor: profile.backgroundColor }}
        >
          <img
            src={profile.profileImage || "defaultImage.png"}
            alt="Profile"
            className={styles.sharedProfileImage}
          />
          <h3 style={{ fontFamily: profile.fontFamily, color: profile.fontColor }}>
            {profile.profileTitle}
          </h3>
        </div>
        <div className={styles.linksScrollContainer}>
          <LinkList
            type="mobile"
            layout={profile.layout}
            buttonColor={profile.buttonColor}
            fontFamily={profile.fontFamily}
            fontColor={profile.fontColor}
            buttonStyle={profile.buttonStyle}
            buttonRadius={profile.buttonRadius}
            buttonFontColor={profile.buttonFontColor}
            links={profile.links} // Pass links to LinkList
          />
          <ShopList
            type="mobile"
            shopLinks={profile.shopLinks} // Pass shopLinks to ShopList
          />
        </div>
        <button
          className={styles.getConnected}
          onClick={() => {
            // Route to home page
            window.location.href = "/";
            // Increment click count for the user's profile
            axios.put(`${BASE_URL}/api/${profile.userId}/increment-click`);
          }}
        >
          Get Connected
        </button>
        <img src={BSparkImg} alt="Spark" className={styles.sparkImg} />
      </div>
    </div>
  );
};

export default SharedPage;