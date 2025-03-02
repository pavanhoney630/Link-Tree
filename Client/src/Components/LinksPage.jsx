import React, { useState, useEffect } from "react";
import Header from "./Header"
import Sidebar from "./SideBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoMdShare } from "react-icons/io";
import { GoShare } from "react-icons/go";
import styles from "../css/LinksPage.module.css";
import BSparkImg from "../assets/BSparkImg.png";
import LinkModal from "../../modal/LinkModal";
import LinksList from "../../Render/LinkList";
import ShopList from "../../Render/ShopList"
import logo from "../assets/fire.png"

const LinksPage = () => {
  
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [profileTitle, setProfileTitle] = useState("");
  const [bio, setBio] = useState("");
  const [activeTab, setActiveTab] = useState("links");
  const [activeButton, setActiveButton] = useState("addLink");
  const [customBackgroundCode, setCustomBackgroundCode] = useState("#000000");
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const [theme, setTheme] = useState("Air Snow"); // Default theme
  const [layout, setLayout] = useState("stack"); // Default layout
  const [fontFamily, setFontFamily] = useState("Poppins");
    const [fontColor, setFontColor] = useState("#000000");

  // Retrieve theme and layout from local storage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("selectedTheme");
    const savedLayout = localStorage.getItem("selectedLayout");

    if (savedTheme) {
      setTheme(savedTheme);
    }
    if (savedLayout) {
      setLayout(savedLayout);
    }
  }, []);
  
  const themes = [
    { name: "Air Snow", backgroundColor: "#ffffff" },
    { name: "Air Grey", backgroundColor: "#f0f0f0" },
    { name: "Air Smoke", backgroundColor: "#e0e0e0" },
    { name: "Air Black", backgroundColor: "#d0d0d0" },
    { name: "Mineral Blue", backgroundColor: "#e3f2fd" },
    { name: "Mineral Green", backgroundColor: "#e8f5e9" },
    { name: "Mineral Orange", backgroundColor: "#fff3e0" },
  ];

  const selectedThemeBackground = themes.find((t) => t.name === theme)?.backgroundColor || "#ffffff";

  useEffect(() => {
    const savedFontFamily = localStorage.getItem("selectedFontFamily");
    const savedFontColor = localStorage.getItem("selectedFontColor");

    if (savedFontFamily) {
      setFontFamily(savedFontFamily);
    }
    if (savedFontColor) {
      setFontColor(savedFontColor);
    }
  }, []);

  const [appearanceSettings, setAppearanceSettings] = useState({
    buttonColor: "#ffffff",
    buttonFontColor: "#888888",
    buttonStyle: "fill",
    buttonRadius: "8px",
  
  });


  
  const username = localStorage.getItem("username");

const [shopLinks, setShopLinks] = useState([]);

  const BASE_URL =
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_DEV_URL
      : import.meta.env.VITE_PROD_URL;

     
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. Redirect to login.");
        return;
      }

      
      try {
        const response = await axios.get(`${BASE_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        

        const data = response.data;
        

        // Handle profileImage URL
        const imageUrl = data.profile?.profileImage || "defaultImage.png";
        setProfileImage(
          imageUrl.startsWith("http")
            ? imageUrl
            : `/uploads/${imageUrl}`
        );

        setProfileTitle(data.profile?.profileTitle || "");
        setBio(data.profile?.bio || "");
        setCustomBackgroundCode(data.profile?.backgroundColor || "#000000");
        setAppearanceSettings({
          buttonColor: data.profile?.buttonColor || "#ffffff",
          buttonFontColor: data.profile?.buttonFontColor || "#888888",
          fontColor: data.profile?.fontColor || "#000000",
          buttonStyle: data.profile?.buttonStyle || "fill",
          buttonRadius: data.profile?.buttonRadius || "8px",
        
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Failed to fetch user data. Please try again.");
      }
    };

    fetchUserData();
  }, [BASE_URL]);

  const {
    buttonColor,
    buttonFontColor,
    buttonStyle,
    buttonRadius,
   
  } = appearanceSettings;

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      // Show the selected image immediately (before upload)
      const localUrl = URL.createObjectURL(file);
      setProfileImage(localUrl);

      // Upload image to backend
      const response = await axios.post(
        `${BASE_URL}/api/user/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update state with backend URL
      if (response.data && response.data.profileImage) {
        setProfileImage(`${response.data.profileImage}?${Date.now()}`);
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
      alert("Failed to upload image. Please try again.");
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.put(
            `${BASE_URL}/api/user/profile`,
            {
                profileTitle,
                bio,
                profileImage, // Include the latest profileImage
                backgroundColor: customBackgroundCode,
                buttonColor,
                buttonFontColor,
                fontFamily,
                fontColor,
                buttonStyle,
                buttonRadius,
                theme,
            },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        alert("Profile updated successfully!");
        
        // ✅ Save updated data in localStorage
        localStorage.setItem("customBackground", customBackgroundCode);

        // ✅ Update state to reflect changes immediately
        setUserData(response.data.profile);

        // ✅ Trigger a storage event manually (so other components detect changes)
        window.dispatchEvent(new Event("storage"));

    } catch (error) {
        console.error("Error updating profile:", error);
        alert("Failed to update profile. Please try again.");
    }
};



  const handleRemoveProfileImage = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${BASE_URL}/api/user/profile`,
        { profileImage: "" }, // Clear the image on the backend
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfileImage("");
      
    } catch (error) {
      console.error("Error removing profile image:", error);
    }
  };

  
  const handleAddLink = async (linkData) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${BASE_URL}/api/links`,
        linkData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        alert("Link created successfully!");
        // Optionally, refresh the links list or update state
      }
    } catch (error) {
      console.error("Error creating link:", error);
      alert("Failed to create link. Please try again.");
    }
  };

  useEffect(() => {
 
  }, [profileImage]);

  const handleAddShop = async ({ shopTitle, shopUrl }) => {
    if (!shopTitle || !shopUrl) {
      alert("Please provide a valid shop title and URL.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token"); // Ensure token is stored in localStorage
  
      const response = await axios.post(
        `${BASE_URL}/api/products`,
        { title: shopTitle, productLink: shopUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.status === 201) {
        setShopLinks((prevShopLinks) => [...prevShopLinks, response.data.product]);

      }
    } catch (error) {
      console.error("Error adding shop:", error.response?.data?.message || error.message);
      alert("Failed to add shop. Please try again.");
    }
  };
  const handleSubmit = (data) => {
    
  
    if (activeButton === "addLink") {
     
      handleAddLink(data);
    } else if (activeButton === "addShop") {
    
      handleAddShop(data);
    }
  };
  
  const handleGetConnectedClick = async () => {
    try {
      // Route to the home page ("/")
      navigate("/");
  
      // Retrieve token and userId from local storage
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
  
      console.log("Token:", token); // Debugging
      console.log("userId from local storage:", userId); // Debugging
  
      if (!token || !userId) {
        console.error("No token or userId found");
        return;
      }
  
      const headers = { Authorization: `Bearer ${token}` };
  
      // Debugging: Log the request URL and headers
      console.log("Request URL:", `${BASE_URL}/api/${userId}/increment-click`);
      console.log("Request headers:", headers);
  
      // Make the API call to increment the click count
      const response = await axios.put(
        `${BASE_URL}/api/${userId}/increment-click`,
        {}, // Empty payload (if not required by backend)
        { headers }
      );
  
      console.log("Profile click count updated:", response.data);
    } catch (error) {
      console.error("Error updating profile click count:", error);
  
      // Log additional error details
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up the request:", error.message);
      }
    }
  };

  return (
    
    <div className={styles.container}>
      <Sidebar userData={userData} />

      <main className={styles.mainContent}>
        <Header/>

        <section className={styles.contentContainer}>
          <div className={styles.mobilePreview} 
          style={{ backgroundColor: selectedThemeBackground }} 
           >
         
          <div className={styles.previewCard}>
  <div className={styles.previewHeader} style={{ backgroundColor: customBackgroundCode }}>
    <button className={styles.previewShareButton}>
      <GoShare className={styles.shareIcon} />
    </button>
    <img
      src={profileImage || "defaultImage.png"}
      alt="Profile"
      className={styles.mobilepreviewProfileImage}
      onError={(e) => { e.target.src = "defaultImage.png"; }}
    />
     <h3 className={styles.h3} style={{ fontFamily, color: fontColor }}>{profileTitle}</h3>
  </div>

  <div className={styles.previewButtons}>
    <button
      className={activeTab === "links" ? styles.activeButton : styles.inactiveButton}
      onClick={() => setActiveTab("links")}
    >
      Links
    </button>
    <button
      className={activeTab === "shop" ? styles.activeButton : styles.inactiveButton}
      onClick={() => setActiveTab("shop")}
    >
      Shop
    </button>
  </div>

  <div className={styles.dynamicContent}>
  {activeTab === "links"
    ? (userData?.links || []).map((link, index) => (
        <button key={index} className={styles.socialButton}>
          <img src={link.icon} alt={link.name} className={styles.socialIcon} />
          {link.name}
        </button>
      ))
    : (userData?.shopLinks || []).map((product, index) => (
        <button key={index} className={styles.productButton}>
          <img src={product.image} alt={product.title} className={styles.productIcon} />
          {product.title}
          <div className={styles.shopActions}>
            <button className={styles.buyNow}>Buy Now</button>
            <img src="/shopping-cart-icon.png" alt="Cart" className={styles.cartIcon} />
          </div>
        </button>
      ))}
         <div className={styles.linksScrollContainer}>
   {activeButton === "addLink" && (
 <LinksList type="mobile" links={userData?.links || []}  layout={layout} buttonColor={buttonColor}
 fontFamily={fontFamily}
 fontColor={fontColor}
 buttonStyle={buttonStyle}
 buttonRadius={buttonRadius}
 buttonFontColor={buttonFontColor}/>
)}
{activeButton === "addShop" && (
  <ShopList type="mobile" shopLinks={userData?.shopLinks || []} />
)}

</div>
</div>


  <button className={styles.getConnected} onClick={handleGetConnectedClick}>Get Connected</button>
  <img src={BSparkImg} alt="BSpark" className={styles.bSparkImg} />
</div>
          </div>
        </section>
      </main>

      <button className={styles.globalShareButton}>
        <IoMdShare className={styles.shareIcon} /> Share
      </button>

      <div className={styles.profileCustomizationContainer}>
        <h3 className={styles.profile}>Profile</h3>
        <div className={styles.profileCustomization}>
          <div className={styles.profileWrapper}>
            {/* Profile Image and Buttons */}
            <div className={styles.profileImageButtonContainer}>
              <img
                src={profileImage || "defaultImage.png"}
                alt="Profile"
                className={styles.previewProfileImage}
                onError={(e) => { e.target.src = "defaultImage.png"; }}
              />
              <div className={styles.buttonContainer}>
                <input
                  type="file"
                  id="profileImageUpload"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleProfileImageChange}
                  className={styles.input}
                />
                <label htmlFor="profileImageUpload" className={styles.uploadButton}>
                  Pick an image
                </label>
                <button className={styles.removeButton} onClick={handleRemoveProfileImage}>
                  Remove
                </button>
              </div>
            </div>

            {/* Profile Title and Bio */}
            <div className={styles.inputFieldsContainer}>
              <div className={styles.inputGroup}>
                <label htmlFor="profileTitle" className={styles.inputLabel}>Profile Title</label>
                <input
                  type="text"
                  id="profileTitle"
                  value={profileTitle}
                  onChange={(e) => setProfileTitle(e.target.value)}
                  className={styles.input}
                  placeholder="Enter your profile title"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="bio" className={styles.inputLabel}>Bio</label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Enter your bio"
                  maxLength="80"
                  className={styles.textarea}
                ></textarea>
                <span className={styles.charCount}>{bio.length}/80</span>
              </div>
            </div>
          </div>
        </div>

        {/* Add Link/Shop Section */}
        <div className={styles.addLinkShopSection}>
          <div
            className={`${styles.toggleSwitchContainer} ${
              activeButton === "addLink" ? styles.addLinkActive : styles.addShopActive
            }`}
          >
            {/* Slider */}
            <div className={styles.toggleSwitchSlider}></div>

            {/* Buttons */}
            <button
              className={`${styles.addLinkButton} ${
                activeButton === "addLink" ? styles.active : ""
              }`}
              onClick={() => setActiveButton("addLink")}
            >
              Add Link
            </button>
            <button
              className={`${styles.addShopButton} ${
                activeButton === "addShop" ? styles.active : ""
              }`}
              onClick={() => setActiveButton("addShop")}
            >
              Add Shop
            </button>
          </div>
          <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>+ Add</button>
          <div className={`${styles.linksContainer}`}>
          <div className={`${styles.linksContainer}`}>
          {activeButton === "addLink" && (
            <LinksList type="dashboard" links={userData?.links || []}/>

)}
{activeButton === "addShop" && (
<ShopList type="dashboard" shopLinks={userData?.shopLinks || [] } />
)}

</div>

</div>
        </div>
        {isModalOpen && (
  <LinkModal
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    onSubmit={handleSubmit}
  />
)}
        {/* Banner Customization */}
        <h3>Banner</h3>
        <div className={styles.bannerCustomization}>
          <div className={styles.bannerPreview} style={{ backgroundColor: customBackgroundCode }}>
            <div className={styles.bannerImage}>
              <img
                src={profileImage || "defaultImage.png"}
                alt="Profile"
                className={styles.previewProfileImage}
              />
              <h3 style={{ fontFamily, color: fontColor }}>@{profileTitle}</h3>
              <h5 style={{ fontFamily, color: fontColor }}><img src={logo} className={styles.logo}/>/{profileTitle}</h5>
            </div>
          </div>

          {/* Default Colors */}
          <h4>Custom Background Code</h4>
          <div className={styles.defaultColors}>
            <button
              className={styles.colorButton}
              style={{ backgroundColor: "#000000" }}
              onClick={() => setCustomBackgroundCode("#000000")}
            ></button>
            <button
              className={styles.colorButton}
              style={{ backgroundColor: "#FFFFFF" }}
              onClick={() => setCustomBackgroundCode("#FFFFFF")}
            ></button>
            <button
              className={styles.colorButton}
              style={{ backgroundColor: "#A52A2A" }}
              onClick={() => setCustomBackgroundCode("#A52A2A")}
            ></button>
          </div>

          {/* Custom Background Code Input */}
          <div className={styles.customBackgroundSection}>
            <div className={styles.customBackgroundInput}>
              {/* Color Picker */}
              <input
                type="color"
                value={customBackgroundCode}
                onChange={(e) => setCustomBackgroundCode(e.target.value)}
                className={styles.colorPicker}
              />
              {/* Hex Code Input */}
              <input
                type="text"
                value={customBackgroundCode}
                onChange={(e) => setCustomBackgroundCode(e.target.value)}
                placeholder="#000000"
                className={styles.backgroundInput}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button onClick={handleSave} className={styles.saveButton}>
          Save
        </button>
      </div>
      
    </div>
   
  );
};

export default LinksPage;