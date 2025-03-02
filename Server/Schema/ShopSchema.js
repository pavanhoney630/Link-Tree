const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  productLink: { type: String, required: true },
  clickCount: { type: Number, default: 0 } , // Track clicks
  visible: { type: Boolean, default: true } // ✅ Ensure visible is true by default
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product
