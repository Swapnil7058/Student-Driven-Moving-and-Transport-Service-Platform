import mongoose from "mongoose";
import crypto from "crypto";

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    whatsapp: {
      type: String,
      unique: true,
      trim: true,
    },

    age: {
      type: Number,
      min: 18,
      max: 30,
    },

    college: {
      type: String,
      trim: true,
    },

    roles: {
      type: String,
      enum: ["packing", "loading/unloading", "driving"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "blocked", "rejected"],
      default: "pending",
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    otp: String,
    otpExpires: Date,
    emailVerificationToken: {
      type: String,
      default: null,
    },
    emailVerificationExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, index: true },
);

studentSchema.index({
  name: "text",
  email: "text",
  phone: "text",
  college: "test",
});


studentSchema.pre("save", async function(){
  if(!this.studentId){
    this.studentId = "STU-" + crypto.randomBytes(4).toString("hex").toUpperCase();
  }

});

const Students = mongoose.model("Students", studentSchema);
export default Students;
