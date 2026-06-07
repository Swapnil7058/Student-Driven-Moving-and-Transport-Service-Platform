import mongoose from "mongoose";

const customItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  instructions: String,
  fragile: Boolean,
});

const quoteSchema = new mongoose.Schema(
  {
    zipFrom: {
      type: String,
      required: true,
    },
    fromAddressLine1: {
      type: String,
      required: true,
    },
    fromStreet: {
      type: String,
      required: true,
    },
    fromLandmark: {
      type: String,
      default: "",
    },
    zipTo: {
      type: String,
      required: true,
    },
    toAddressLine1: {
      type: String,
      required: true,
    },
    toStreet: {
      type: String,
      required: true,
    },
    toLandmark: {
      type: String,
      default: "",
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    moveDate: {
      type: String,
      required: true,
    },
    propertySize: {
      type: String,
      required: true,
    },

    hasSpecialItems: {
      type: String,
      enum: ["yes", "no"],
      default: "no",
    },

    specialItemsList: {
      type: [String],
      default: [],
    },

    customItems: {
      type: [customItemSchema],
      default: [],
    },

    fromLocation: String,
    toLocation: String,

    distanceKm: Number,

    fromCoordinates: {
      lat: Number,
      lng: Number,
    },

    toCoordinates: {
      lat: Number,
      lng: Number,
    },

    invoice: {
      services: [
        {
          name: String,
          rate: Number,
          quantity: Number,
          total: Number,
        },
      ],
      tax: Number,
      total: Number,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "quoted",
        "confirmed",
        "in-progress",
        "completed",
        "rejected",
      ],
      default: "pending",
    },

    rejectionReason: {
      type: String,
      default: "",
      trim: true,
    },

    assignedTeam: {
      type: String,
      default: null,
    },
    sheduledAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

quoteSchema.index({ status: 1 });
quoteSchema.index({ createdAt: -1 });
quoteSchema.index({ fullName: 1 });
quoteSchema.index({ email: 1 });
quoteSchema.index({ phone: 1 });

const Quote = mongoose.model("Quote", quoteSchema);
export default Quote;
