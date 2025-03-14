const Link = require("../Schema/LinkSchema");
const jwt = require("jsonwebtoken");


// Create a new link
const createLink = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id; // Extract userId from token

    const { title, url, logo } = req.body;

    // Allowed logos (predefined set of social media icons)
    const allowedLogos = ["instagram", "facebook", "youtube", "x"];

    if (!title || !url || !logo) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate URL format
    const urlPattern = /^(https?:\/\/)?([\w\-]+\.)+[\w]{2,}(\/\S*)?$/;
    if (!urlPattern.test(url)) {
      return res.status(400).json({ message: "Invalid URL format" });
    }

    // Validate logo selection
    if (!allowedLogos.includes(logo.toLowerCase())) {
      return res.status(400).json({ message: "Invalid logo selection" });
    }

    // Create a new link with userId
    const newLink = new Link({ userId, title, url, logo });
    await newLink.save();

    return res.status(201).json({ message: "Link created successfully", link: newLink });
  } catch (error) {
    return res.status(500).json({ message: "Error creating link", error: error.message });
  }
};
// Track link click
const trackClick = async (req, res) => {
  const { linkId } = req.params;

  try {
    const link = await Link.findById(linkId);

    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    link.clicks += 1; // Increment click count
    await link.save();

    return res.status(200).json({ message: "Click recorded", totalClicks: link.clicks });
  } catch (error) {
    return res.status(500).json({ message: "Error tracking click", error: error.message });
  }
};

// Get links (Fetch all links OR redirect if linkId is provided)
const getLinks = async (req, res) => {
  const { linkId } = req.params;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    if (linkId) {
      const link = await Link.findOne({ _id: linkId, userId });

      if (!link) {
        return res.status(404).json({ message: "Link not found" });
      }

      link.clicks += 1;
      await link.save();

      return res.redirect(link.url);
    } else {
      // ✅ Include `url` in the response
      const links = await Link.find({ userId }).select("title logo clicks url");

      return res.status(200).json({ message: "Links retrieved successfully", links });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving links", error: error.message });
  }
};

module.exports = { createLink, trackClick, getLinks };
