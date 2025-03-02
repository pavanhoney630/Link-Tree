const Product = require('../Schema/ShopSchema');
const jwt = require('jsonwebtoken');

const axios = require("axios");
const cheerio = require("cheerio");

const createProduct = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id; // Extract user ID from token

    const { title, productLink } = req.body;

    if (!title || !productLink) {
      return res.status(400).json({ message: "Title and Product Link are required" });
    }

    // Fetch the page content from productLink to extract the image URL
    const response = await axios.get(productLink, {
      headers: {
        "User-Agent": "Mozilla/5.0", // Some websites block non-browser requests
      },
    });
    const $ = cheerio.load(response.data);

    // Extract image URL
    let imageUrl =
      $('meta[property="og:image"]').attr("content") || // Open Graph image
      $('img[data-old-hires]').attr("data-old-hires") || // High-res image
      $('img[data-src]').attr("data-src") || // Lazy-loaded image
      $('img').first().attr("src"); // First available image

    // Convert relative URLs to absolute URLs if needed
    if (imageUrl && !imageUrl.startsWith("http")) {
      imageUrl = new URL(imageUrl, productLink).href;
    }

    if (!imageUrl) {
      return res.status(400).json({ message: "No image found on the product page" });
    }

    // Create a new product with userId
    const newProduct = new Product({
      userId,
      title,
      productLink,
      imageUrl,
      clickCount: 0,
    });

    await newProduct.save();

    return res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    return res.status(500).json({ message: "Error creating product", error: error.message });
  }
};


// Create a new product
const trackProductClick = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.clickCount += 1;
    await product.save();

    return res.status(200).json({ message: "Click tracked successfully", clickCount: product.clickCount });
  } catch (error) {
    return res.status(500).json({ message: "Error tracking click", error: error.message });
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id; // Extract user ID from token

    // Find products by userId
    const products = await Product.find({ userId }).select("title productLink imageUrl visible  clickCount");

    return res.status(200).json({ message: "Products retrieved successfully", products });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving products", error: error.message });
  }
};


module.exports = { createProduct, getProducts, trackProductClick  };
