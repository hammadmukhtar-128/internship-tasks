import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    method: { type: String, default: "demo_card" },
    status: { type: String, enum: ["success", "failed"], required: true },
    transactionRef: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
