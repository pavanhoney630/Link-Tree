const express = require('express');
const Product = require('../Schema/ShopSchema');
const router = express.Router();
const { createProduct, getProducts, trackProductClick  } = require('../Controllers/ShopController');


// Create a new product
router.post("/products", createProduct);

router.put('/track-click/:productId', trackProductClick);

// Get all products
router.get("/products", getProducts);

router.post("/toggle-product-visibility/:id", async (req, res) => {
    try {
        const { id } = req.params;  // Fixed variable name (was productId before)
        const { visible } = req.body; // Get visible state from request body

        // Find the product by ID
        let product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found!" });
        }

        // Toggle visibility
        product.visible = visible;
        await product.save();

        res.json({ success: true, message: "Product visibility updated!", updatedProduct: product });
    } catch (error) {
        console.error("Error updating product visibility:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
