const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Schema/AuthSchema");

const signup = async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (!firstName || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: "All required fields must be filled" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            username: "", // Initially empty
        });

        await newUser.save();

        // Generate a TEMPORARY token for setting the username
        const tempToken = jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "10m" } // Short-lived token (10 minutes)
        );

        res.status(201).json({
            message: "User registered successfully",
            token: tempToken,// Send this token for setting username
            id: newUser._id

        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const setUsername = async (req, res) => {
    const { username } = req.body;
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from headers

    if (!username) {
        return res.status(400).json({ message: "Username is required" });
    }

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id; // Extract userId from token

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Username set successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

  const login = async (req, res) => {
    const { username, password } = req.body;  // Use username instead of email
  
    // Check if both fields are provided
    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    try {
      // Find the user by username
      const user = await User.findOne({ username });  // Look up by username
      if (!user) {
        return res.status(400).json({ message: "Invalid username or password" });
      }
  
      // Compare the password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid username or password" });
      }
  
      // Generate a JWT token with user info
      const token = jwt.sign(
        { id: user._id, firstName: user.firstName, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      res.status(200).json({
        message: "Login successful",
        token: token,  // Include the generated JWT token
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,  // Include email in the response for user info
          username: user.username,  // Include the username
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };

const getUser = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Extract token from headers
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        const userId = decoded.id; // Extract userId from token

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
            password: "********",  // Mask password
            confirmPassword: "********", // Mask confirm password
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


// Update user profile
const updateUser = async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        let updateFields = {};

        if (firstName) updateFields.firstName = firstName;
        if (lastName) updateFields.lastName = lastName;
        if (email) updateFields.email = email;

        if (password) {
            if (password !== confirmPassword) {
                return res.status(400).json({ message: "Passwords do not match" });
            }
            const salt = await bcrypt.genSalt(10);
            updateFields.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true, omitUndefined: true });

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: updatedUser._id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

  module.exports = {
    signup,
    login,
    setUsername,
    getUser,
    updateUser
  };