const express = require("express");
const router = express.Router();
const Link = require("../Schema/LinkSchema");
const { createLink, trackClick, getLinks } = require("../Controllers/LinkController");

router.post("/links", createLink); // Create a new link
router.get("/:linkId/click", trackClick); // Track click count
router.get('/links', getLinks)
router.put("/links/:linkId", async (req, res) => {
    try {
      const { linkId } = req.params;
      const { visible } = req.body;
  
      const updatedLink = await Link.findByIdAndUpdate(linkId, { visible }, { new: true });
  
      if (!updatedLink) {
        return res.status(404).json({ message: "Link not found" });
      }
  
      res.json({ message: "Visibility updated", link: updatedLink });
    } catch (error) {
      console.error("Error updating visibility:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  // Track Click Count - Only if the link is visible
router.get("/:linkId/click", async (req, res) => {
    try {
      const { linkId } = req.params;
      const link = await Link.findById(linkId);
  
      if (!link) {
        return res.status(404).json({ message: "Link not found" });
      }
  
      if (!link.visible) {
        return res.status(403).json({ message: "This link is currently disabled" });
      }
  
      link.clicks += 1; // Increment click count
      await link.save();
      res.json({ message: "Click tracked successfully" });
    } catch (error) {
      console.error("Error tracking click:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Toggle visibility for Links
  router.post("/toggle-link-visibility/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { visible } = req.body;
  
      console.log(`Received toggle request for ID: ${id}, New Visibility: ${visible}`);
  
      let link = await Link.findById(id);
      if (!link) {
        console.log(`❌ Link not found: ${id}`);
        return res.status(404).json({ success: false, message: "Link not found!" });
      }
  
      link.visible = visible;  // Update visibility
      await link.save();  // Save to DB
  
      console.log(`✅ Successfully updated link visibility: ${id}, Now Visible: ${link.visible}`);
  
      res.json({ success: true, message: "Link visibility updated!", updatedLink: link });
    } catch (error) {
      console.error("❌ Error updating link visibility:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });
  
  
  
module.exports = router;
