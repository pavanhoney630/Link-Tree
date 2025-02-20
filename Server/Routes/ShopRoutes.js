const express = require('express');
const router = express.Router();
const { createProduct, getProducts } = require('../Controllers/ShopController');

// Create a new product
router.post("/products", createProduct);

// Get all products
router.get("/products", getProducts);

module.exports = router;
