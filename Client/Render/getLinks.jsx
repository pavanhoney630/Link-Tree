import { useState, useEffect } from "react";
import axios from "axios";

const getLinks = () => {
  const [links, setLinks] = useState([]);
  const [shopLinks, setShopLinks] = useState([]);

  const BASE_URL =
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_DEV_URL
      : import.meta.env.VITE_PROD_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("❌ No token found");
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        // Fetch both links and shop links simultaneously
        const [linksResponse, shopResponse] = await Promise.all([
          axios.get(`${BASE_URL}/api/links`, { headers }),
          axios.get(`${BASE_URL}/api/products`, { headers }),
        ]);

       

        setLinks(linksResponse.data.links || []);
        setShopLinks(shopResponse.data.products || []);

        // Log AFTER setting state
    
        
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // `BASE_URL` does not need to be a dependency unless it dynamically changes

  // Track click count for normal links
  const trackClick = async (linkId, visible) => {
    if (!visible) {
      alert("This link is disabled and cannot be accessed.");
      return;
    }
    try {
      await axios.get(`${BASE_URL}/api/${linkId}/click`);
    } catch (error) {
      console.error("❌ Error tracking click:", error);
    }
  };

  const trackShopClick = async (productId) => {
    try {
      console.log("Tracking click for product:", productId);
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
  
      // Track the click
      const trackResponse = await axios.put(`${BASE_URL}/api/track-click/${productId}`, {}, { headers });
      console.log("Track Click Response:", trackResponse.data);
  
      // Refetch shop links to get the updated click counts
      const fetchResponse = await axios.get(`${BASE_URL}/api/products`, { headers });
      console.log("Fetch Products Response:", fetchResponse.data);
  
      // Extract the `products` array from the response
      if (fetchResponse.data && Array.isArray(fetchResponse.data.products)) {
        setShopLinks(fetchResponse.data.products); // Update local state with the latest data
      } else {
        console.error("❌ API response does not contain a valid products array:", fetchResponse.data);
        setShopLinks([]); // Set to empty array to avoid runtime errors
      }
    } catch (error) {
      console.error("❌ Error tracking shop click:", error);
    }
  };
 
  const toggleVisibility = async (itemId, type = "link") => {
    // Debug log to verify arguments
    console.log(`toggleVisibility called with itemId: ${itemId}, type: ${type}`);
  
    // Validate type
    if (!["link", "shop"].includes(type)) {
      console.error("Invalid type:", type);
      return;
    }
  
    let updatedVisibility = false;
  
    if (type === "shop") {
      setShopLinks((prevShopLinks) =>
        prevShopLinks.map((shopItem) => {
          if (shopItem._id === itemId) {
            updatedVisibility = !shopItem.visible;
            console.log(`Toggling shop item ${itemId} visibility to:`, updatedVisibility);
            return { ...shopItem, visible: updatedVisibility };
          }
          return shopItem;
        })
      );
    } else if (type === "link") {
      setLinks((prevLinks) => {
        const updatedLinks = prevLinks.map((linkItem) => {
          if (linkItem._id === itemId) {
            updatedVisibility = !linkItem.visible;
            console.log(`Toggling link item ${itemId} visibility to:`, updatedVisibility);
            return { ...linkItem, visible: updatedVisibility };
          }
          return linkItem;
        });
        console.log("Updated links:", updatedLinks);
        return updatedLinks;
      });
    }
  
    try {
      const apiUrl =
        type === "shop"
          ? `${BASE_URL}/api/toggle-product-visibility/${itemId}`
          : `${BASE_URL}/api/toggle-link-visibility/${itemId}`;
  
      console.log(`Calling API: ${apiUrl} with visibility:`, updatedVisibility);
      await axios.post(apiUrl, { visible: updatedVisibility });
  
      console.log(`✅ Visibility toggled for ${type}: ${updatedVisibility}`);
    } catch (error) {
      console.error("❌ Error toggling visibility:", error);
    }
  };
  
  return { links, shopLinks, trackClick, trackShopClick,toggleVisibility}

}

export default getLinks;
