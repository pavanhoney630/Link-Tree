const mongoose = require("mongoose");

const LinkSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user
    title: { type: String, required: true, maxlength: 100 }, // Link title
    url: { type: String, required: true }, // Link URL
    logo: { type: String, required: true }, // Application logo (e.g., YouTube, Facebook)
    clicks: { type: Number, default: 0 }, // Click count
    visible: { type: Boolean, default: true } // ✅ Ensure visible is true by default
  },
  { timestamps: true }
);

const Link = mongoose.model("Link", LinkSchema);

module.exports = Link

