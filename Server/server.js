const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const AuthRoutes = require('./Routes/AuthRoutes');
const ProfileRoutes = require('./Routes/ProfileRoutes');
const LinkRoutes = require('./Routes/LinkRoutes');
const ShopRoutes = require('./Routes/ShopRoutes');
const path = require("path");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

app.get("/pavan", (req, res) => {
  res.send("Kalyan");
});

const corsOptions = {
  origin: ["https://link-tree-front-tau.vercel.app", "http://localhost:5173"], // URL of your React frontend
  methods: ["GET", "POST", "PUT", "DELETE"], // HTTP methods allowed
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use('/auth', AuthRoutes);
app.use('/api', ProfileRoutes);
app.use('/api', LinkRoutes);
app.use('/api', ShopRoutes);
// Serve static files from the 'uploads' folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "src/assets")));


const mongo_url = process.env.MONGO_URI;

mongoose
  .connect(mongo_url)
  
  .then(() => {
    
    console.log("MongoDB Connected...");
    
  })
  .catch((err) => {
    console.log("MongoDB Connection Error: ", err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});