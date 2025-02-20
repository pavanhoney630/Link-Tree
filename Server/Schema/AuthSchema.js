const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },   // Required
  lastName: { type: String },                    // Optional
  email: { type: String, required: true, unique: true }, // Unique email
  password: { type: String, required: true },
  username: { type: String, default: "" },  // Not required at signup, set later
  profileImage: { type: String }, // URL of uploaded image
  profileTitle: { type: String, maxlength: 100 }, // Custom title
  bio: { type: String, maxlength: 500 } // Short bio
});

const User = mongoose.model("User", userSchema);

module.exports = User;
