import React from "react";
import { FaTrash, FaPencilAlt } from "react-icons/fa";
import getLinks from "../Render/getLinks";
import styles from "../src/css/LinksList.module.css";

import youtubeLogo from "../src/assets/Youtube.png";
import facebookLogo from "../src/assets/Facebook.png";
import instagramLogo from "../src/assets/Instagram.png";
import xLogo from "../src/assets/X.jpg";

const logoMap = {
  youtube: youtubeLogo,
  facebook: facebookLogo,
  instagram: instagramLogo,
  x: xLogo,
};

const LinksList = ({ type, layout, buttonColor, fontFamily, buttonFontColor, buttonRadius }) => {
  const { links, handleEdit, handleDelete, toggleVisibility, trackClick } = getLinks();

  return (
    <div
      className={`${styles.linkList} ${type === "mobile" ? styles.mobilePreview : ""} ${
        styles[layout]
      }`}
      style={{ fontFamily: fontFamily }}
    >
      {links.map((link) => (
        <div
          key={link._id}
          className={`${styles.linkItem} ${!link.visible ? styles.disabled : ""}`}
          style={{
            backgroundColor: typeof buttonColor === "string" ? buttonColor : "transparent",
            borderRadius:
              typeof buttonRadius === "number"
                ? `${buttonRadius}px`
                : typeof buttonRadius === "string"
                ? buttonRadius
                : "0px",
            padding: "10px",
          }}
        >
          {type === "dashboard" && (
            <div className={styles.reorderIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M6.75 2.25h3v3h-3zm7.5 0h3v3h-3zm-7.5 5.5h3v3h-3zm7.5 0h3v3h-3zm-7.5 5.5h3v3h-3zm7.5 0h3v3h-3zm-7.5 5.5h3v3h-3zm7.5 0h3v3h-3z" />
              </svg>
            </div>
          )}

          <div className={styles.linkDetails}>
            <div className={styles.logoTitleContainer}>
              {type === "mobile" && link.logo && logoMap[link.logo?.trim()?.toLowerCase()] && (
                <img src={logoMap[link.logo.trim().toLowerCase()]} alt={link.logo} className={styles.linkLogo} />
              )}

              <a
                href={link.visible ? link.url : "#"}
                target={link.visible ? "_blank" : ""}
                rel="noopener noreferrer"
                className={styles.linkTitle}
                style={{ color: buttonFontColor || "#000" }}
                onClick={(e) => {
                  if (!link.visible) {
                    e.preventDefault();
                    alert("This link is disabled.");
                  } else {
                    trackClick(link._id);
                  }
                }}
              >
                {link.title}
              </a>

              {type === "dashboard" && (
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={link.visible || false} // Ensure controlled input
                    onChange={() => toggleVisibility(link._id, "link")}
                  />
                  <FaPencilAlt className={styles.editIcon} onClick={() => handleEdit(link)} />
                  <span className={styles.slider}></span>
                </label>
              )}
            </div>

            {type === "dashboard" && (
              <div className={styles.linkUrlContainer}>
                <p className={styles.linkUrl} title={link?.url || ""}>
                  {link?.url && link.url.length > 30 ? `${link.url.substring(0, 30)}...` : link?.url || "No URL"}
                </p>
                <FaPencilAlt className={styles.editIcon} onClick={() => handleEdit(link)} />
              </div>
            )}

            {type === "dashboard" && (
              <div className={styles.bottomRow}>
                <div className={styles.clickTracker}>
                  <img
                    src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxNCIgdmlld0JveD0iMCAwIDE0IDE0Ij4KCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik00Ljc1IDcuNUguNXY2aDQuMjVtNC41LTloLTQuNXY5aDQuNU0xMy41LjVIOS4yNXYxM2g0LjI1eiIgc3Ryb2tlLXdpZHRoPSIxIiAvPgo8L3N2Zz4="
                    alt="Bar Chart"
                    className={styles.barChartIcon}
                  />
                  <span>{link.clicks} clicks</span>
                </div>
                <FaTrash className={styles.deleteIcon} onClick={() => handleDelete(link._id)} />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LinksList;