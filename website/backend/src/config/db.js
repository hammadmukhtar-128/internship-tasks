import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  try {
    await mongoose.connect(uri, { dbName: "clinic_management" });
    console.log("MongoDB connected:", mongoose.connection.host);
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    throw err;
  }

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err.message);
  });
}
