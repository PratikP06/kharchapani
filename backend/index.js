import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import route from "./routes/loginRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import transactionRoute from "./routes/transactionRoute.js";

dotenv.config();

const port = process.env.PORT;
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/api/user", route);
app.use("/api/transaction", transactionRoute);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useUnifiedTopology: true });
    console.log("mongo DB connected successfully..");

    app.listen(port, () => {
      console.log(`app started at port : ${port}`);
    });
  } catch (error) {
    console.log("connection failed");
    console.error(error.message);
    process.exit(1);
  }
};
connectDB();
