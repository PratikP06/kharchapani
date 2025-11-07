import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/userModel.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const route = express.Router();

route.get("/check", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ status: "failed", message: "User not found" });
    }

    res.status(200).json({
      status: "success",
      user: {
        name: user.name,
        email: user.email,
        balance: user.balance,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "serverError" });
  }
});



route.post("/register", async (req, res) => {
  try {
    const { name, password, email } = req.body;
    const isExisting = await User.findOne({ email });

    if (isExisting) {
      return res.status(400).json({ message: "User already exists" });
    }

    const saltRounds = 10;
    const hashPass = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      name,
      email,
      password: hashPass,
      balance: 0,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET ,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User registered successfully",
      user: { name: newUser.name, email: newUser.email },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});


route.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET ,
      { expiresIn: "1h" }
    );

 
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, 
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful!",
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default route;
