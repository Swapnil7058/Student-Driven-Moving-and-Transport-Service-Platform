import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    quoteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quote",
      required: true,
    },

    customerName: {
      type: String,
      required: true,
    },

    from: {
      type: String,
      required: true,
    },

    to: {
      type: String,
      required: true,
    },

    workType: {
      type: [String],
      required: true,
    },

    requiredStudents: {
      type: Number,
      required: true,
    },

    acceptedStudents: [
      {
        studentId: String,
        name: String,
        email: String,
        phone: String,
        college: String,
        task: String,
        availabilityConfirmed: {
          type: Boolean,
          default: false,
        },
        note: {
          type: String,
          default: "",
          trim: true,
        },
        acceptedAt: {
          type: Date,
          default: null,
        },
      },
    ],

    truckRequired: {
      type: String,
      enum: ["yes", "no"],
      default: "no",
    },

    truckSize: {
      type: String,
      enum: ["small", "medium", "large"],
    },

    truckCount: {
      type: Number,
      default: 0,
    },

    jobSchedule: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "open",
        "partially-filled",
        "filled",
        "in-progress",
        "completed",
      ],
      default: "open",
    },

    completedAt: {
      type: Date,
      default: null,
    },

    workProgress: {
      packingDone: {
        type: Boolean,
        default: false,
      },
      loadingDone: {
        type: Boolean,
        default: false,
      },
      truckArrived: {
        type: Boolean,
        default: false,
      },
      unloadingDone: {
        type: Boolean,
        default: false,
      },
      objectsSetupDone: {
        type: Boolean,
        default: false,
      },
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const Job = mongoose.model("Job", jobSchema);
export default Job;
