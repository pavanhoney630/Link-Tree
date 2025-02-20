const express = require("express");
const router = express.Router();
const { createLink, trackClick, getLinks } = require("../Controllers/LinkController");

router.post("/links", createLink); // Create a new link
router.get("/:linkId/click", trackClick); // Track click count
router.get('/links', getLinks)

module.exports = router;
