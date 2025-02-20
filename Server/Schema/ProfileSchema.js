const mongoose = require("mongoose");

// Reference to the Link Schema
const Link = require("../Schema/LinkSchema");  // Adjust the path as needed

const userProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    profileImage: {
      type: String,
      default: 'https://via.placeholder.com/150?text=🙂',
    },
    profileTitle: {
      type: String,
      default: 'My Awesome Profile',
    },
    bio: {
      type: String,
      default: 'This is my bio!',
    },
    backgroundColor: {
      type: String,
      default: '#ffcc00',
    },
    buttonStyle: {
      type: String,
      default: 'fill',
    },
    buttonColor: {
      type: String,
      default: '#3498db',
    },
    buttonFontColor: {
      type: String,
      default: '#ffffff',
    },
    fontFamily: {
      type: String,
      default: 'Arial',
    },
    fontColor: {
      type: String,
      default: '#000000',
    },
    layout: {
      type: String,
      enum: ['grid', 'list'],
      default: 'grid',
    },
    theme: {
      type: String,
      enum: ['Air Snow', 'Air Grey', 'Air Smoke', 'Air Black', 'Mineral Blue', 'Mineral Green', 'Mineral Orange'],
      default: 'Air Snow',
    },
    clickCount: {
      type: Number,
      default: 0,
    },
    links: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Link", // Reference to the Link model
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  }
);

const  ProfileSchema = mongoose.model("UserProfile", userProfileSchema);

module.exports = ProfileSchema;
