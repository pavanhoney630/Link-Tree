const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const UserProfile = require("../Schema/ProfileSchema");
require('dotenv').config();

const app = express();

// Ensure the 'uploads' folder exists
const uploadsDir = path.join(__dirname, "../uploads"); // Adjusted path

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const sanitizedFileName = file.originalname
      .replace(/[^a-zA-Z0-9.]/g, "_")
      .toLowerCase();
    cb(null, `${Date.now()}-${sanitizedFileName}`);
  },
});

const upload = multer({ storage });





// Base URL setup
const Base_URL = process.env.NODE_ENV === "production"
  ? process.env.PROD_BASE_URL
  : process.env.DEV_BASE_URL;

  // Middleware to handle image upload
const uploadImage = upload.single("profileImage");


// Create or update user profile
const createOrUpdateUserProfile = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { profileTitle, bio, backgroundColor } = req.body;
    const profileImage = req.file ? `${Base_URL}/uploads/${req.file.filename}` : userProfile?.profileImage || "";


    let userProfile = await UserProfile.findOne({ userId });

    if (userProfile) {
      userProfile.profileTitle = profileTitle || userProfile.profileTitle;
      userProfile.bio = bio || userProfile.bio;
      userProfile.backgroundColor = backgroundColor || userProfile.backgroundColor;

      if (profileImage) {
        userProfile.profileImage = profileImage; // Update if new image is uploaded
      }

      await userProfile.save();
    } else {
      userProfile = new UserProfile({
        userId,
        profileTitle,
        bio,
        backgroundColor,
        profileImage,
        theme,
      });

      await userProfile.save();
    }

    // Send back the full profile, including the image URL
    return res.status(200).json({
      message: "Profile updated successfully",
      profile: {
        profileTitle: userProfile.profileTitle,
        bio: userProfile.bio,
        backgroundColor: userProfile.backgroundColor,
        profileImage: userProfile.profileImage || "", // Ensure it's not undefined
        theme:userProfile.theme,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    return res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};



const updateProfileAppearance = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded?.id;
    if (!userId) return res.status(403).json({ message: "Invalid token" });

    // Destructure text fields from request body
    const {
      profileTitle,
      bio,
      backgroundColor,
      theme,
      layout,
      buttonStyle,
      buttonColor,
      buttonFontColor,
      fontFamily,
      fontColor
    } = req.body;

    // Find user profile
    let userProfile = await UserProfile.findOne({ userId });

    // Get the uploaded file path or use existing profileImage
    const profileImage = req.file ? `${Base_URL}/uploads/${req.file.filename}` : userProfile?.profileImage || "";
    console.log("Base_URL:", Base_URL);
    console.log("Profile Image:", profileImage);

    if (!userProfile) {
      // Create new profile if not found
      userProfile = new UserProfile({
        userId,
        profileTitle,
        bio,
        backgroundColor,
        theme,
        layout,
        buttonStyle,
        buttonColor,
        buttonFontColor,
        fontFamily,
        fontColor,
        profileImage
      });
    } else {
      // Update existing profile
      userProfile.profileTitle = profileTitle || userProfile.profileTitle;
      userProfile.bio = bio || userProfile.bio;
      userProfile.backgroundColor = backgroundColor || userProfile.backgroundColor;
      userProfile.theme = theme || userProfile.theme;
      userProfile.layout = layout || userProfile.layout;
      userProfile.buttonStyle = buttonStyle || userProfile.buttonStyle;
      userProfile.buttonColor = buttonColor || userProfile.buttonColor;
      userProfile.buttonFontColor = buttonFontColor || userProfile.buttonFontColor;
      userProfile.fontFamily = fontFamily || userProfile.fontFamily;
      userProfile.fontColor = fontColor || userProfile.fontColor;

      // Update profileImage only if a new file was uploaded
      if (req.file) {
        userProfile.profileImage = `${Base_URL}/uploads/${req.file.filename}`;
      }
    }

    // Save profile
    await userProfile.save();
    res.status(200).json({ message: "Profile updated successfully", profile: userProfile });

  } catch (error) {
    console.error("Error updating profile:", error.message);
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};


const cleanBase_URL = Base_URL?.endsWith("/")
  ? Base_URL.slice(0, -1)
  : Base_URL;

  const getUserProfile = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
  
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
  
      const userProfile = await UserProfile.findOne({ userId })
        .populate("links", "title logo")
        .exec();
  
      if (!userProfile) {
        return res.status(404).json({ message: "Profile not found" });
      }
  
      // Ensure profileImage is correctly formatted
      const profileImage = userProfile.profileImage
        ? userProfile.profileImage.startsWith("http")
          ? userProfile.profileImage // Full URL, use as is
          : `${cleanBase_URL}${userProfile.profileImage.startsWith("/uploads/") ? userProfile.profileImage : "/uploads/" + userProfile.profileImage}`
        : `${cleanBase_URL}/uploads/defaultImage.png`;
  
      return res.status(200).json({
        message: "User profile retrieved successfully",
        profile: {
          userId: userProfile.userId,
          profileImage,
          profileTitle: userProfile.profileTitle,
          bio: userProfile.bio,
          backgroundColor: userProfile.backgroundColor,
          layout: userProfile.layout,
          theme: userProfile.theme,
          buttonColor: userProfile.buttonColor, // Include buttonColor
          buttonFontColor: userProfile.buttonFontColor, // Include buttonFontColor
          fontFamily: userProfile.fontFamily,
          fontColor: userProfile.fontColor,
          links: userProfile.links,
        },
      });
    } catch (error) {
      return res.status(500).json({ message: "Failed to authenticate token", error: error.message });
    }
  };

  const generateProfileLink = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    // Check if token exists
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id; // Extract user ID from decoded token

        // Find the user's profile with links and shopLinks
        const userProfile = await UserProfile.findOne({ userId })
            .populate("links") // Populate the links array
            .populate("shopLinks"); // Populate the shopLinks array

        // Check if profile exists
        if (!userProfile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        // Create a shareable link to the profile
        const profileLink = `${Base_URL}/api/shared/${userProfile._id}`; // Include /api prefix

        // Return the shareable link and full profile data (read-only)
        return res.status(200).json({
            message: "Shareable profile link generated successfully",
            profileLink: profileLink, // Generated shareable link
            profileData: {
                userId: userProfile.userId, // Include userId in the response
                profileTitle: userProfile.profileTitle,
                profileImage: userProfile.profileImage,
                backgroundColor: userProfile.backgroundColor,
                buttonColor: userProfile.buttonColor,
                buttonFontColor: userProfile.buttonFontColor,
                fontFamily: userProfile.fontFamily,
                fontColor: userProfile.fontColor,
                layout: userProfile.layout,
                buttonStyle: userProfile.buttonStyle,
                buttonRadius: userProfile.buttonRadius,
                theme: userProfile.theme,
                links: userProfile.links, // Include populated links
                shopLinks: userProfile.shopLinks, // Include populated shopLinks
            },
        });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to authenticate token', error: error.message });
    }
};
const incrementProfileClick = async (req, res) => {
  const { userId } = req.params; // Extract userId from URL
  console.log("Received userId:", userId);

  // Extract token from Authorization header
  const token = req.headers.authorization?.split(" ")[1];

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const tokenUserId = decoded.id; // Extract user ID from decoded token

    // Check if the userId from the token matches the userId in the URL
    if (userId !== tokenUserId) {
      return res.status(403).json({ message: "Forbidden: You can only update your own profile click count" });
    }

    // Find the user's profile by userId
    const userProfile = await UserProfile.findOne({ userId });

    if (!userProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Increment the profile's click count
    userProfile.clickCount = (userProfile.clickCount || 0) + 1;
    await userProfile.save();

    return res.status(200).json({
      message: "Profile click count updated successfully",
      clickCount: userProfile.clickCount, // Return updated count
    });
  } catch (error) {
    return res.status(500).json({ message: "Error updating profile click count", error: error.message });
  }
};


module.exports={
    createOrUpdateUserProfile,
    getUserProfile,
    updateProfileAppearance,
    generateProfileLink,
    incrementProfileClick,
    uploadImage,
}