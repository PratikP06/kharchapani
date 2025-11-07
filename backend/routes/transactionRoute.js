import User from "../model/userModel.js";
import Transaction from "../model/transactionSchema.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import express from "express";
import mongoose from "mongoose";

const transactionRoute = express.Router();

transactionRoute.post("/add", verifyToken, async (req, res) => {
  try {
    const { title, amount, type, category } = req.body;
    const userId = req.user.id;

    const newTransaction = new Transaction({
      userId,
      title,
      category,
      amount,
      type,
    });

    await newTransaction.save();

    const user = await User.findById(userId);
    if (type === "income") {
      user.balance += amount;
    } else if (type === "expenses") {
      user.balance -= amount;
    }

    await user.save();
    res.status(200).json({
      status: "success",
      message: "Balance updated successfully",
      balance: user.balance,
      transaction: newTransaction,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "serverError",
    });
  }
});

transactionRoute.get("/all", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.find({ userId }).sort({ date: -1 });

    res.status(200).json({
      status: "success",
      transactions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "serverError",
    });
  }
});

transactionRoute.get("/bal", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      status: "success",
      balance: user.balance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "serverError",
    });
  }
});

transactionRoute.delete("/del/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const transactionId = req.params.id;

    const transaction = await Transaction.findOne({
      _id: transactionId,
      userId,
    });
    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });

    const user = await User.findById(userId);

    if (transaction.type === "expenses") {
      user.balance += transaction.amount;
    } else if (transaction.type === "income") {
      user.balance -= transaction.amount;
    }

    await user.save();
    await transaction.deleteOne();

    res.status(200).json({
      status: "success",
      message: "Transaction deleted successfully",
      balance: user.balance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "serverError",
    });
  }
});

export default transactionRoute;
