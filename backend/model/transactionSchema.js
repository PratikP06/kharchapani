import mongoose, { model, Schema } from "mongoose";

const transactionSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  title: {
    type: String,
    required :true
  },

  category: {
    type: String,
    required :true
  },

  amount: {
    type : Number,
    required : true
  },

  type : {
    type : String,
    enum : ["income" , "expenses"],
    required : true
  },
  date : {
    type : Date,
    default : Date.now
  }
});


const Transaction = mongoose.model("Transaction" , transactionSchema);
export default Transaction;