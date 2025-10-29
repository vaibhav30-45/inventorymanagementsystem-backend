import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/userModel.js";
dotenv.config();

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(" Email from request:", email);
    console.log(" Password from request:", password);

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
      password: password.trim(),
    });

    console.log(" User found in DB:", user);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
