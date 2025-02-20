const UserProfile = require('../Schema/ProfileSchema'); // Assuming UserProfile model is in the models folder
const jwt = require('jsonwebtoken');


const Base_URL = process.env.NODE_ENV === 'production' 
  ? '' // Replace with your actual production URL
  : `${req.protocol}://${req.get('host')}`;

const createOrUpdateUserProfile = async (req, res) => {
    // Extract token from Authorization header
    const token = req.headers.authorization?.split(" ")[1];

    // Check if token exists
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id; // Extract user ID from decoded token

        // Destructure input data from request body
        const { profileImage, profileTitle, bio, backgroundColor } = req.body;

        // Validate and prepare the update or creation data
        const updatedProfileData = {
            profileImage: profileImage || 'https://via.placeholder.com/150?text=🙂', // Default emoji placeholder
            profileTitle,
            bio,
            backgroundColor: backgroundColor || '#ffffff', // Default white background color
        };

        // Check if user profile already exists
        const existingProfile = await UserProfile.findOne({ userId });

        if (existingProfile) {
            // Update existing user profile
            existingProfile.profileImage = updatedProfileData.profileImage;
            existingProfile.profileTitle = updatedProfileData.profileTitle;
            existingProfile.bio = updatedProfileData.bio;
            existingProfile.backgroundColor = updatedProfileData.backgroundColor;

            // Save updated profile
            await existingProfile.save();
            return res.status(200).json({ message: 'User profile updated successfully', profile: existingProfile });
        } else {
            // Create a new user profile
            const newUserProfile = new UserProfile({
                userId,
                ...updatedProfileData,
            });

            // Save new profile to the database
            await newUserProfile.save();
            return res.status(201).json({ message: 'User profile created successfully', profile: newUserProfile });
        }

    } catch (error) {
        return res.status(500).json({ message: 'Failed to authenticate token', error: error.message });
    }
};

// Update Profile & Appearance
const updateProfileAppearance = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const { profileTitle, bio, backgroundColor, themeColor, layout, buttonStyle, buttonColor, buttonFontColor, fontFamily, fontColor } = req.body;

        let userProfile = await UserProfile.findOne({ userId });

        if (!userProfile) {
            // Create new profile if not exists
            userProfile = new UserProfile({
                userId,
                profileTitle,
                bio,
                backgroundColor,
                themeColor, // Add themeColor here
                layout,
                buttonStyle,
                buttonColor,
                buttonFontColor,
                fontFamily,
                fontColor
            });
        } else {
            // Update existing profile
            userProfile.profileTitle = profileTitle || userProfile.profileTitle;
            userProfile.bio = bio || userProfile.bio;
            userProfile.backgroundColor = backgroundColor || userProfile.backgroundColor;
            userProfile.themeColor = themeColor || userProfile.themeColor; // Update themeColor
            userProfile.layout = layout || userProfile.layout;
            userProfile.buttonStyle = buttonStyle || userProfile.buttonStyle;
            userProfile.buttonColor = buttonColor || userProfile.buttonColor;
            userProfile.buttonFontColor = buttonFontColor || userProfile.buttonFontColor;
            userProfile.fontFamily = fontFamily || userProfile.fontFamily;
            userProfile.fontColor = fontColor || userProfile.fontColor;
        }

        await userProfile.save();
        res.status(200).json({ message: "Profile updated successfully", profile: userProfile });

    } catch (error) {
        res.status(500).json({ message: "Error updating profile", error });
    }
};


const getUserProfile = async (req, res) => {
    // Extract token from Authorization header
    const token = req.headers.authorization?.split(" ")[1];
  
    // Check if token exists
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
  
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id; // Extract user ID from decoded token
  
      // Retrieve the user's profile from the database and populate the links
      const userProfile = await UserProfile.findOne({ userId })
        .populate("links", "title logo") // Only include the link title and logo (exclude clicks)
        .exec();
  
      // Check if profile exists
      if (!userProfile) {
        return res.status(404).json({ message: "Profile not found" });
      }
  
      // Send the user's profile data
      return res.status(200).json({
        message: 'User profile retrieved successfully',
        profile: {
          userId: userProfile.userId,
          profileImage: userProfile.profileImage,
          profileTitle: userProfile.profileTitle,
          bio: userProfile.bio,
          backgroundColor: userProfile.backgroundColor,
          layout: userProfile.layout,
          theme: userProfile.theme,
          links: userProfile.links, // This will include the populated links
        }
      });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to authenticate token', error: error.message });
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

        // Find the user's profile with links
        const userProfile = await UserProfile.findOne({ userId });

        // Check if profile exists
        if (!userProfile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        // Create a shareable link to the profile
        const profileLink = `${Base_URL}/profile/${userProfile._id}`;

        // Return the shareable link and full profile data
        return res.status(200).json({
            message: "Shareable profile link generated successfully",
            profileLink: profileLink, // Generated shareable link
            profileData: userProfile, // Profile data including links
        });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to authenticate token', error: error.message });
    }
};


const incrementProfileClick = async (req, res) => {
  const { userId } = req.params; // Extract userId from URL

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

}