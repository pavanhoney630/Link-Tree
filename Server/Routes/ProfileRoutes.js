const router = require("express").Router();

const {createOrUpdateUserProfile,updateProfileAppearance,getUserProfile, generateProfileLink, incrementProfileClick,} = require("../Controllers/UserController");


router.post('/user/profile', createOrUpdateUserProfile);

router.put("/update-profile", updateProfileAppearance);

router.get('/user/profile', getUserProfile);

router.get('/user/link', generateProfileLink)

router.put('/:userId/increment-click', incrementProfileClick)

router



module.exports = router;