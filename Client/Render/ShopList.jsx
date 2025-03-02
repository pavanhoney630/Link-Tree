import React, { useState, useEffect } from "react";
import { FaTrash, FaPencilAlt, FaShoppingCart } from "react-icons/fa";
import getLinks from "../Render/getLinks";
import axios from "axios";
import styles from "../src/css/ShopList.module.css";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_DEV_URL
    : import.meta.env.VITE_PROD_URL;

const ShopList = ({ type }) => {
  const { shopLinks: initialShopLinks, handleEdit, handleDelete, toggleVisibility } = getLinks();
  const [shopLinks, setShopLinks] = useState(initialShopLinks);

  // Fetch shop links on component mount
  useEffect(() => {
    const fetchShopLinks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("❌ No token found");
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(`${BASE_URL}/api/products`, { headers });

        console.log("API Response:", response.data);

        if (response.data && Array.isArray(response.data.products)) {
          setShopLinks(response.data.products);
        } else {
          console.error("❌ API response does not contain a valid products array:", response.data);
          setShopLinks([]);
        }
      } catch (error) {
        console.error("❌ Error fetching shop links:", error);
        setShopLinks([]);
      }
    };

    fetchShopLinks();
  }, []);

  const trackShopClick = async (productId) => {
    try {
      console.log("Tracking click for product:", productId);
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const trackResponse = await axios.put(`${BASE_URL}/api/track-click/${productId}`, {}, { headers });
      console.log("Track Click Response:", trackResponse.data);

      const fetchResponse = await axios.get(`${BASE_URL}/api/products`, { headers });
      console.log("Fetch Products Response:", fetchResponse.data);

      if (fetchResponse.data && Array.isArray(fetchResponse.data.products)) {
        setShopLinks(fetchResponse.data.products);
      } else {
        console.error("❌ API response does not contain a valid products array:", fetchResponse.data);
        setShopLinks([]);
      }
    } catch (error) {
      console.error("❌ Error tracking shop click:", error);
    }
  };

  useEffect(() => {
    console.log("Shop Links Updated:", shopLinks);
  }, [shopLinks]);

  console.log("Component Re-rendered");

  return (
    <div className={`${styles.ShopList} ${type === "mobile" ? styles.mobilePreview : ""}`}>
      {shopLinks.map((product) => {
        console.log("Rendering Product:", product);
        console.log("Rendering Product Clicks:", product.clicks);
        return (
          <div key={product._id} className={`${styles.linkItem} ${!product.visible ? styles.disabled : ""}`}>
            {/* Render product details */}
            <div className={styles.linkDetails}>
              {type === "mobile" ? (
                <>
                  {/* Mobile View */}
                  <img src={product.imageUrl} alt={product.title} className={styles.productImage} />
                  <p className={styles.productTitle}>{product.title}</p>
                  <a
                    href={product.visible ? product.productLink : "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (!product.visible) {
                        e.preventDefault();
                        alert("This product is disabled.");
                      } else {
                        console.log("Opening link:", product.productLink);
                        trackShopClick(product._id);
                      }
                    }}
                    className={styles.buyNowBtn}
                  >
                    <FaShoppingCart /> Buy Now
                  </a>
                </>
              ) : (
                <>
                  {/* Dashboard View */}
                  <div className={styles.logoTitleContainer}>
                    <div className={styles.editableTitle}>
                      <a
                        href={product.visible ? product.productLink : "#"}
                        onClick={(e) => {
                          if (!product.visible) {
                            e.preventDefault();
                            alert("This product is disabled.");
                          } else {
                            console.log("Opening link:", product.productLink);
                            trackShopClick(product._id);
                            window.open(product.productLink, "_blank");
                          }
                        }}
                        className={!product.visible ? styles.disabledLink : ""}
                      >
                        {product.title}
                      </a>
                      <FaPencilAlt className={styles.editIcon} onClick={() => handleEdit(product)} />
                    </div>
                    <label className={styles.switch}>
                      <input type="checkbox" checked={product.visible} onChange={() => toggleVisibility(product._id)} />
                      <span className={styles.slider}></span>
                    </label>
                  </div>

                  <div className={styles.linkUrlContainer}>
                    <p className={styles.linkUrl} title={product?.url || ""}>
                      {product?.productLink && product.productLink.length > 30
                        ? `${product.productLink.substring(0, 30)}...`
                        : product?.productLink || "No URL"}
                    </p>
                    <FaPencilAlt className={styles.editIcon} onClick={() => handleEdit(product)} />
                  </div>

                  <div className={styles.bottomRow}>
                    <div className={styles.clickTracker}>
                      <img
                        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxNCIgdmlld0JveD0iMCAwIDE0IDE0Ij4KCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik00Ljc1IDcuNUguNXY2aDQuMjVtNC41LTloLTQuNXY5aDQuNU0xMy41LjVIOS4yNXYxM2g0LjI1eiIgc3Ryb2tlLXdpZHRoPSIxIiAvPgo8L3N2Zz4="
                        alt="Bar Chart"
                        className={styles.barChartIcon}
                      />
                      <span>{product.clickCount} clicks</span>
                    </div>
                    <FaTrash className={styles.deleteIcon} onClick={() => handleDelete(product._id)} />
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ShopList;