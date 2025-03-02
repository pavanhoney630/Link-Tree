const router = require("express").Router();
const UserProfile = require("../Schema/ProfileSchema");
const {createOrUpdateUserProfile, uploadImage,updateProfileAppearance,getUserProfile, generateProfileLink, incrementProfileClick,} = require("../Controllers/UserController");


router.post('/user/profile', uploadImage,createOrUpdateUserProfile);

router.put("/user/profile",uploadImage, updateProfileAppearance);

router.get('/user/profile', getUserProfile);

router.post('/generate-profile-link', generateProfileLink);

router.get('/shared/:profileId', async (req, res) => {
    const { profileId } = req.params;

    try {
        // Find the profile by profileId
        const userProfile = await UserProfile.findById(profileId)
            .populate("links") // Populate the links array
            .populate("shopLinks"); // Populate the shopLinks array

        // Check if profile exists
        if (!userProfile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        // Return the profile data (read-only)
        res.status(200).json({
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
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

router.put('/:Id/increment-click', incrementProfileClick)

router



module.exports = router;