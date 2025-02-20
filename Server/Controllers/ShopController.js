const Product = require('../Schema/ShopSchema');
const jwt = require('jsonwebtoken');

// Create a new product
const createProduct = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { title, productLink, imageUrl } = req.body;

    if (!title || !productLink || !imageUrl) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProduct = new Product({ title, productLink, imageUrl });
    await newProduct.save();

    return res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    return res.status(500).json({ message: "Error creating product", error: error.message });
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    return res.status(200).json({ message: "Products retrieved successfully", products });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving products", error: error.message });
  }
};

module.exports = { createProduct, getProducts };
