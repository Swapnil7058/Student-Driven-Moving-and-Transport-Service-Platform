import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exist();
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const admin = await User.create({
      name: "Vanman Admin",
      email: "vanmanadmin@gmail.com",
      phone: "1234567890",
      whatsapp: "1234567890",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin Created Successfully:");
    console.log(admin);

    process.exit();
  } catch (err) {
    console.error("Error creating admin:", err);
    process.exit(1);
  }
};


createAdmin();