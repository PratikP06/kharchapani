import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxLength: 100,
  },

  email: {
    type: String,
    required: true,
    maxLength: 250,
  },
  password: {
    type: String,
    required: true,
    maxLength: 100,
  },
  balance: {
    type: Number,
  },
});

const User = model("User", userSchema);
export default User;
