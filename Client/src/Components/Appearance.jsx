import React, { useEffect, useState } from "react";
import axios from "axios";
import { GoShare } from "react-icons/go";
import Sidebar from "./SideBar";
import Header from "./Header";
import styles from "../css/Appearance.module.css";
import LinkList from "../../Render/LinkList";
import ShopList from "../../Render/ShopList";
import BSparkImg from "../assets/BSparkImg.png";

// Import Layout Icons
import stackIcon from "../assets/stack.png";
import gridIcon from "../assets/grid.png";
import carouselIcon from "../assets/carousel.png";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_DEV_URL
    : import.meta.env.VITE_PROD_URL;

const Appearance = ({ userData, readOnly = false }) => {
  const [activeTab, setActiveTab] = useState("links");
  const [profileTitle, setProfileTitle] = useState("Guest");
  const [profileImage, setProfileImage] = useState("defaultImage.png");
  const [customBackgroundCode, setCustomBackgroundCode] = useState("#342b26");
  const [buttonColor, setButtonColor] = useState("#ffffff");
  const [buttonFontColor, setButtonFontColor] = useState("#888888");
  const [fontFamily, setFontFamily] = useState("Poppins");
  const [fontColor, setFontColor] = useState("#000000");
  const [layout, setLayout] = useState("stack");
  const [buttonStyle, setButtonStyle] = useState("fill");
  const [buttonRadius, setButtonRadius] = useState("8px");
  const [theme, setThemeBackground] = useState("Air Snow");

  // List of font families for the dropdown
  const fontFamilies = [
    "Poppins",
    "DM Sans",
    "Roboto",
    "Open Sans",
    "Montserrat",
    "Lato",
    "Raleway",
    "Inter",
  ];

  // List of themes with their background colors
  const themes = [
    { name: "Air Snow", backgroundColor: "#ffffff" },
    { name: "Air Grey", backgroundColor: "#EBEEF1" },
    { name: "Air Smoke", backgroundColor: "#2A3235" },
    { name: "Air Black", backgroundColor: "#1C1C1C" },
    { name: "Mineral Blue", backgroundColor: "#E0F6FF" },
    { name: "Mineral Green", backgroundColor: "#E0FAEE" },
    { name: "Mineral Orange", backgroundColor: "#FFEEE2" },
    { name: "Mineral yellow", backgroundColor: "#FFF8E0" },
  ];

  // Fetch profile data
  const fetchUserProfile = async () => {
    try {
      let response;
      if (readOnly) {
        // Fetch profile data for shared link (no token required)
        const profileId = window.location.pathname.split("/").pop(); // Extract profileId from URL
        response = await axios.get(`${BASE_URL}/api/shared/${profileId}`);
      } else {
        // Fetch profile data for logged-in user
        const token = localStorage.getItem("token");
        if (!token) return;
        response = await axios.get(`${BASE_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      const profile = response.data?.profile || {};
      setProfileTitle(profile.profileTitle || "Guest");
      setProfileImage(profile.profileImage || "defaultImage.png");
      setCustomBackgroundCode(profile.backgroundColor || "#342b26");
      setButtonColor(profile.buttonColor || "#ffffff");
      setButtonFontColor(profile.buttonFontColor || "#888888");
      setFontFamily(profile.fontFamily || "Poppins");
      setFontColor(profile.fontColor || "#000000");
      setLayout(profile.layout || "stack");
      setButtonStyle(profile.buttonStyle || "fill");
      setButtonRadius(profile.buttonRadius || "8px");
      setThemeBackground(profile.theme || "#ffffff");
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [readOnly]);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.put(
        `${BASE_URL}/api/user/profile`,
        {
          profileTitle,
          backgroundColor: customBackgroundCode,
          layout,
          buttonColor,
          buttonFontColor,
          fontFamily,
          fontColor,
          buttonStyle,
          buttonRadius,
          theme,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Profile updated successfully!");
      fetchUserProfile(); // Re-fetch profile to ensure consistency
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleThemeChange = (selectedTheme) => {
    if (readOnly) return; // Disable theme change in read-only mode
    setThemeBackground(selectedTheme.name);
    localStorage.setItem("selectedTheme", selectedTheme.name);
  };
  localStorage.setItem("selectedLayout", layout); // Save layout

  const handleFontFamilyChange = (e) => {
    if (readOnly) return; // Disable font family change in read-only mode
    const selectedFontFamily = e.target.value;
    setFontFamily(selectedFontFamily);
    localStorage.setItem("selectedFontFamily", selectedFontFamily);
  };

  const handleFontColorChange = (e) => {
    if (readOnly) return; // Disable font color change in read-only mode
    const selectedFontColor = e.target.value;
    setFontColor(selectedFontColor);
    localStorage.setItem("selectedFontColor", selectedFontColor);
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.mainContent}>
        <Header />
        <div className={styles.appearanceContent}>
           {/* Mobile Preview */}
           <div
            className={styles.mobilePreview}
            style={{ backgroundColor: themes.find(t => t.name === theme)?.backgroundColor || "#ffffff" }}
          >
            <div
              className={styles.previewCard}
              style={{
                fontFamily,
                backgroundColor: theme,
                color: fontColor,
              }}
            >
              <div
                className={styles.previewHeader}
                style={{ backgroundColor: customBackgroundCode }}
              >
                <button className={styles.previewShareButton}>
                  <GoShare className={styles.shareIcon} />
                </button>
                <img
                  src={profileImage}
                  alt="Profile"
                  className={styles.mobilepreviewProfile}
                />
                <h3 style={{ fontFamily, color: fontColor }}>{profileTitle}</h3>
              </div>
              <div className={styles.previewButtons}>
                <button
                  className={
                    activeTab === "links"
                      ? styles.activeButton
                      : styles.inactiveButton
                  }
                  onClick={() => setActiveTab("links")}
                >
                  Links
                </button>
                <button
                  className={
                    activeTab === "shop"
                      ? styles.activeButton
                      : styles.inactiveButton
                  }
                  onClick={() => setActiveTab("shop")}
                >
                  Shop
                </button>
              </div>
              <div className={styles.linksScrollContainer}>
                {activeTab === "links" ? (
                  <LinkList
                    type="mobile"
                    layout={layout}
                    buttonColor={buttonColor}
                    fontFamily={fontFamily}
                    fontColor={fontColor}
                    buttonStyle={buttonStyle}
                    buttonRadius={buttonRadius}
                    buttonFontColor={buttonFontColor}
                  />
                ) : (
                  <ShopList type="mobile" />
                )}
              </div>
              <button className={styles.getConnected}>Get Connected</button>
              <img src={BSparkImg} alt="Spark" className={styles.sparkImg} />
            </div>
          </div>
<div className={styles.LayoutSection}>
  {/* Layout and Button Style Sections */}
  <div className={styles.layoutAndButtonSection}>
  <h3 className={styles.h3}>Layout</h3>
            {/* Layout Section */}
            <div className={styles.layoutSection}>
              
              <div className={styles.layoutOptions}>
                {[
                  { id: "stack", src: stackIcon, label: "Stack" },
                  { id: "grid", src: gridIcon, label: "Grid" },
                  { id: "carousel", src: carouselIcon, label: "Carousel" },
                ].map(({ id, src, label }) => (
                  <button
                    key={id}
                    className={`${styles.layoutButton} ${
                      layout === id ? styles.selected : ""
                    }`}
                    onClick={() => setLayout(id)}
                  >
                    <img src={src} alt={label} className={styles.layoutIcon} />
                    <h4>{label}</h4>
                  </button>
                ))}
              </div>
            </div>

            {/* Button Style Section */}
            <h3 className={styles.h3}>Buttons</h3>
            <div className={styles.buttonStyleSection}>
              
              {/* Fill Style */}
              <div className={styles.buttonStyleGroup}>
                <h4>Fill</h4>
                <div className={styles.buttonOptions}>
                  {["4px", "12px", "20px"].map((radius) => (
                    <div
                      key={`fill-${radius}`}
                      className={`${styles.buttonOption} ${
                        buttonStyle === "fill" && buttonRadius === radius
                          ? styles.selected
                          : ""
                      }`}
                      onClick={() => {
                        setButtonStyle("fill");
                        setButtonRadius(radius);
                      }}
                      style={{
                        backgroundColor: "#000",
                        borderRadius: radius,
                      }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Outline Style */}
              <div className={styles.buttonStyleGroup}>
                <h4>Outline</h4>
                <div className={styles.buttonOptions}>
                  {["4px", "12px", "20px"].map((radius) => (
                    <div
                      key={`outline-${radius}`}
                      className={`${styles.buttonOption} ${
                        buttonStyle === "outline" && buttonRadius === radius
                          ? styles.selected
                          : ""
                      }`}
                      onClick={() => {
                        setButtonStyle("outline");
                        setButtonRadius(radius);
                      }}
                      style={{
                        border: "2px solid #000",
                        borderRadius: radius,
                        backgroundColor: "transparent",
                      }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Hard Shadow Style */}
              <div className={styles.buttonStyleGroup}>
                <h4>Hard Shadow</h4>
                <div className={styles.buttonOptions}>
                  {["4px", "12px", "20px"].map((radius) => (
                    <div
                      key={`hard-shadow-${radius}`}
                      className={`${styles.buttonOption} ${
                        buttonStyle === "hard-shadow" && buttonRadius === radius
                          ? styles.selected
                          : ""
                      }`}
                      onClick={() => {
                        setButtonStyle("hard-shadow");
                        setButtonRadius(radius);
                      }}
                      style={{
                        backgroundColor: "#000",
                        borderRadius: radius,
                        boxShadow: "4px 4px 0 #000",
                      }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Soft Shadow Style */}
              <div className={styles.buttonStyleGroup}>
                <h4>Soft Shadow</h4>
                <div className={styles.buttonOptions}>
                  {["4px", "12px", "20px"].map((radius) => (
                    <div
                      key={`soft-shadow-${radius}`}
                      className={`${styles.buttonOption} ${
                        buttonStyle === "soft-shadow" && buttonRadius === radius
                          ? styles.selected
                          : ""
                      }`}
                      onClick={() => {
                        setButtonStyle("soft-shadow");
                        setButtonRadius(radius);
                      }}
                      style={{
                        backgroundColor: "#fff",
                        borderRadius: radius,
                        boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.2)",
                      }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Special Style */}
              <div className={styles.buttonStyleGroup}>
                <h4>Special</h4>
                <div className={styles.buttonOptions}>
                  {["4px", "12px", "20px"].map((radius) => (
                    <div
                      key={`special-${radius}`}
                      className={`${styles.buttonOption} ${
                        buttonStyle === "special" && buttonRadius === radius
                          ? styles.selected
                          : ""
                      }`}
                      onClick={() => {
                        setButtonStyle("special");
                        setButtonRadius(radius);
                      }}
                      style={{
                        backgroundColor: "#000",
                        borderRadius: radius,
                        border: "2px dashed #fff",
                      }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Button Color Picker */}
              <div className={styles.colorPickerContainer}>
                <h4>Button color</h4>
                <div
                  className={styles.inputContainer}
                  onClick={() => document.getElementById("buttonColorPicker").click()}
                >
                  <div
                    className={styles.colorPreview}
                    style={{ backgroundColor: buttonColor }}
                  ></div>
                  <div className={styles.hexCodeContainer}>
                    <span>{buttonColor.toUpperCase()}</span>
                  </div>
                  <input
                    type="color"
                    id="buttonColorPicker"
                    value={buttonColor}
                    onChange={(e) => setButtonColor(e.target.value)}
                    className={styles.colorPicker}
                  />
                </div>
              </div>

              {/* Button Font Color Picker */}
              <div className={styles.colorPickerContainer}>
                <h4>Button font color</h4>
                <div
                  className={styles.inputContainer}
                  onClick={() => document.getElementById("buttonFontColorPicker").click()}
                >
                  <div
                    className={styles.colorPreview}
                    style={{ backgroundColor: buttonFontColor }}
                  ></div>
                  <div className={styles.hexCodeContainer}>
                    <span>{buttonFontColor.toUpperCase()}</span>
                  </div>
                  <input
                    type="color"
                    id="buttonFontColorPicker"
                    value={buttonFontColor}
                    onChange={(e) => setButtonFontColor(e.target.value)}
                    className={styles.colorPicker}
                  />
                </div>
              </div>
            </div>

            {/* Fonts Section */}
            <h3 className={styles.h3}>Fonts</h3>
            <div className={styles.fontSection}>
  <h4>Fonts</h4>
  <div className={styles.fontContainer}>
    {/* Combined Aa Preview and Dropdown Block */}
    <div className={styles.fontPreviewDropdown}>
      {/* Aa Preview */}
      <div className={styles.fontPreview}>
        <span className={styles.fontPreviewText} style={{ fontFamily }}>
          Aa
        </span>
      </div>

      {/* Dropdown for Font Families */}
      <select
        value={fontFamily}
        onChange={handleFontFamilyChange} // Use the new handler
        className={styles.fontDropdown}
      >
        {fontFamilies.map((font) => (
          <option key={font} value={font}>
            {font}
          </option>
        ))}
      </select>
    </div>
  </div>



              {/* Font Color Picker */}
              <div className={styles.colorPickerContainer}>
                <h4>color</h4>
                <div
                  className={styles.inputContainer}
                  onClick={() => document.getElementById("fontColorPicker").click()}
                >
                  <div
                    className={styles.colorPreview}
                    style={{ backgroundColor: fontColor }}
                  ></div>
                  <div className={styles.hexCodeContainer}>
                    <span>{fontColor.toUpperCase()}</span>
                  </div>
                  <input
                    type="color"
                    id="fontColorPicker"
                    value={fontColor}
                     onChange={handleFontColorChange} // Use the new handler
                    className={styles.colorPicker}
                  />
                </div>
              </div>
            </div>

            {/* Theme Section */}
            <div className={styles.themeSection}>
              <h3 className={styles.h3}>Themes</h3>
              <div className={styles.themeOptions}>
                {themes.map((themeOption) => (
                  <div
                    key={themeOption.name}
                    className={`${styles.themeOption} ${
                      theme === themeOption.backgroundColor
                        ? styles.selected
                        : ""
                    }`}
                    onClick={() => handleThemeChange(themeOption)}
                  >
                    <div
                      className={styles.themePreview}
                      style={{ backgroundColor: themeOption.backgroundColor }}
                    ></div>
                    <span>{themeOption.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {!readOnly && (
          <button className={styles.saveButton} onClick={handleSave}>
            Save
          </button>
        )}
</div>
      
      </main>
    </div>
  );
};

export default Appearance;