import jwt from "jsonwebtoken";
import User from "./../models/User.js";

export const register = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Account already exists" });
    }
    const user = await User.create({ name, email, password });
    res
      .status(201)
      .json({ message: "User registered successfully", user: user });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ message: "Error registering user" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "all fields are required" });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Account does not exist" });
    }
    const isMatch = await user.isValidPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ message: "Login Success", token });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};
