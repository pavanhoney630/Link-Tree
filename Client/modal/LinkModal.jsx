import React, { useState, useEffect } from "react";
import { FaPencilAlt, FaCopy, FaTrash, FaStore } from "react-icons/fa";
import {
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaXTwitter,
} from "react-icons/fa6";
import styles from "../src/css/LinkModal.module.css";

const LinkModal = ({ isOpen, onClose, onSubmit }) => {
  const [activeTab, setActiveTab] = useState("addLink");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [logo, setLogo] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const [shopTitle, setShopTitle] = useState("");
  const [shopUrl, setShopUrl] = useState("");
  const [shopEnabled, setShopEnabled] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (!document.getElementById("modalContent")?.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isEnabled) {
      console.log("🔵 Submitting Link:", { activeTab, title, url, logo });
  
      if (activeTab === "addLink" && title && url && logo) {
        onSubmit({ title, url, logo }); // Submits link data
        console.log("✅ Link submitted");
      }
      
      setIsEnabled(false);
      onClose();
    }
  
    if (shopEnabled) {
      console.log("🟢 Submitting Shop:", { activeTab, shopTitle, shopUrl });
  
      if (activeTab === "addShop" && shopTitle && shopUrl) {
        onSubmit({ shopTitle, shopUrl }); // Submits shop data
        console.log("✅ Shop submitted");
      }
      
      setShopEnabled(false);
      onClose();
    }
  }, [
    isEnabled,
    shopEnabled,
    activeTab,
    title,
    url,
    logo,
    shopTitle,
    shopUrl,
    onSubmit,
    onClose
  ]);
  
  
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.container}>
        <div id="modalContent" className={styles.modalContent}>
          {/* Tabs */}
          <div className={styles.tabContainer}>
            <button
              className={`${styles.tabButton} ${
                activeTab === "addLink" ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab("addLink")}
            >
              <FaStore className={styles.mallIcon} /> Add Link
            </button>

            <button
              className={`${styles.tabButton} ${
                activeTab === "addShop" ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab("addShop")}
            >
              <FaStore className={styles.mallIcon} /> Add Shop
            </button>
          </div>

          {activeTab === "addLink" && (
            <form className={styles.formContainer}>
              {/* Glide Button for Saving */}
              <div className={styles.toggleContainer}>
                <label className={styles.toggleLabel}>
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={() => setIsEnabled(!isEnabled)}
                    className={styles.toggleInput}
                  />
                  <span className={styles.toggleButton}></span>
                </label>
              </div>

              {/* Link Title Input */}
              <div className={styles.inputGroupContainer}>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Link title"
                    className={styles.smallInput}
                  />
                  <FaPencilAlt className={styles.pencilIcon} />
                </div>
              </div>

              {/* Link URL Input */}
              <div className={styles.inputGroupContainer}>
                <div className={styles.inputWrapper}>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Link URL"
                    className={styles.largeInput}
                  />
                  <FaPencilAlt className={styles.pencilIcon} />
                </div>
                <div className={styles.iconWrapper}>
                  <FaCopy className={styles.icon} />
                  <FaTrash className={styles.icon} />
                </div>
              </div>

              <hr />

              {/* App Icons */}
              <div className={styles.appIcons}>
                <div onClick={() => setLogo("instagram")}>
                  <FaInstagram size={30} color="#E4405F" />
                  <p>Instagram</p>
                </div>
                <div onClick={() => setLogo("facebook")}>
                  <FaFacebook size={30} color="#1877F2" />
                  <p>Facebook</p>
                </div>
                <div onClick={() => setLogo("youtube")}>
                  <FaYoutube size={30} color="#FF0000" />
                  <p>YouTube</p>
                </div>
                <div onClick={() => setLogo("x")}>
                  <FaXTwitter size={30} color="black" />
                  <p>X</p>
                </div>
              </div>
            </form>
          )}

          {activeTab === "addShop" && (
            <div className={styles.shopContainer}>
              <h2>Enter URL</h2>
              <div className={styles.inputGroupContainer}>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    value={shopTitle}
                    onChange={(e) => setShopTitle(e.target.value)}
                    placeholder="Shop title"
                    className={styles.smallInput}
                  />
                  <FaPencilAlt className={styles.pencilIcon} />
                </div>
                <label className={styles.toggleLabel}>
                  <input
                    type="checkbox"
                    checked={shopEnabled}
                    onChange={() => setShopEnabled(!shopEnabled)}
                    className={styles.toggleInput}
                  />
                  <span className={styles.toggleButton}></span>
                </label>
              </div>
              <div className={styles.inputGroupContainer}>
                <div className={styles.inputWrapper}>
                  <input
                    type="url"
                    value={shopUrl}
                    onChange={(e) => setShopUrl(e.target.value)}
                    placeholder="Shop URL"
                    className={styles.largeInput}
                  />
                  <FaPencilAlt className={styles.pencilIcon} />
                </div>
                <div className={styles.iconWrapper}>
                  <FaCopy className={styles.icon} />
                  <FaTrash className={styles.icon} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LinkModal;
