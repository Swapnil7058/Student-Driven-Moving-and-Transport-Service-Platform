import Job from "../models/job.model.js";
import Quote from "../models/quotes.models.js";
import Students from "../models/students.model.js";

const canAccessJobByQuote = async (req, quoteId) => {
  if (req.user?.role === "admin") {
    return true;
  }

  const quote = await Quote.findById(quoteId).select("email");
  return Boolean(quote && req.user?.email === quote.email);
};

export const createJob = async (req, res) => {
  try {
    let {
      quoteId,
      workType,
      requiredStudents,
      truckRequired,
      truckSize,
      truckCount,
      jobSchedule,
    } = req.body;

    console.log("JOB BODY:", req.body);

    requiredStudents = Number(requiredStudents);
    truckCount = Number(truckCount || 0);

    // VALIDATION
    if (
      !quoteId ||
      !Array.isArray(workType) ||
      workType.length === 0 ||
      !requiredStudents ||
      !jobSchedule
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required job details",
      });
    }

    // Search By Id
    const quote = await Quote.findById(quoteId);

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: "Quote not found",
      });
    }

    // Check if Job already Exists
    const existingJob = await Job.findOne({ quoteId });
    if (existingJob) {
      return res.status(400).json({
        success: false,
        message: "Job already exists for this quote",
      });
    }

    // Truck logic
    if (truckRequired === "no") {
      truckSize = undefined;
      truckCount = 0;
    }

    if (truckRequired === "yes" && !truckSize) {
      return res.status(400).json({
        success: false,
        message: "Truck size is required when truck is selected",
      });
    }

    //Create Job
    const job = await Job.create({
      quoteId: quote._id,
      customerName: quote.fullName,
      from: quote.zipFrom,
      to: quote.zipTo,

      workType,
      requiredStudents,

      truckRequired,
      truckSize,
      truckCount,

      jobSchedule,
      workProgress: {
        packingDone: false,
        loadingDone: false,
        truckArrived: false,
        unloadingDone: false,
        objectsSetupDone: false,
      },
      createdBy: req.user?._id || null,
    });

    // update Job status
    quote.status = "in-progress";
    await quote.save();

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: job,
    });
  } catch (error) {
    console.error("❌ Create job error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create job",
    });
  }
};

export const updateJobProgress = async (req, res) => {
  try {
    const { jobId } = req.params;
    const {
      packingDone,
      loadingDone,
      truckArrived,
      unloadingDone,
      objectsSetupDone,
    } = req.body;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    job.workProgress = {
      packingDone: Boolean(packingDone),
      loadingDone: Boolean(loadingDone),
      truckArrived: Boolean(truckArrived),
      unloadingDone: Boolean(unloadingDone),
      objectsSetupDone: Boolean(objectsSetupDone),
    };

    const allDone = Object.values(job.workProgress).every(Boolean);

    if (allDone) {
      job.status = "completed";
      job.completedAt = new Date();
      await Quote.findByIdAndUpdate(job.quoteId, { status: "completed" });
      await Students.updateMany(
        {
          studentId: {
            $in: job.acceptedStudents.map((student) => student.studentId),
          },
        },
        { isActive: true },
      );
    } else {
      if (["filled", "open", "partially-filled"].includes(job.status)) {
        job.status = "in-progress";
      }
      await Quote.findByIdAndUpdate(job.quoteId, { status: "in-progress" });
    }

    await job.save();

    const io = req.app.get("io");

    io.emit("job:progressUpdated", {
      jobId: job._id,
      quoteId: job.quoteId,
      status: job.status,
      workProgress: job.workProgress,
      data: job,
    });

    return res.status(200).json({
      success: true,
      message: "Job progress updated successfully",
      data: job,
    });
  } catch (error) {
    console.error("Update job progress error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update job progress",
    });
  }
};

// ***********************************************************************************************************
// ***********************************************************************************************************
// ***********************************************************************************************************
// ***********************************************************************************************************
export const getJobByQuote = async (req, res) => {
  try {
    const { quoteId } = req.params;

    const allowed = await canAccessJobByQuote(req, quoteId);
    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    const job = await Job.findOne({ quoteId }).populate(
      "acceptedStudents",
      "name email phone",
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "No job assigned  yet",
      });
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.log("Fetch job error", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch job",
    });
  }
};

// ***********************************************************************************************************
// ***********************************************************************************************************
// ***********************************************************************************************************
// ***********************************************************************************************************
export const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId).populate(
      "acceptedStudents",
      "name email phone",
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.error("Fetch job error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch job",
    });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const status = req.query.status || "all";

    const filter = status === "all" ? {} : { status };

    const jobs = await Job.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    console.error("Fetch all jobs error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
    });
  }
};

// ***********************************************************************************************************
// ***********************************************************************************************************
// ***********************************************************************************************************
// ***********************************************************************************************************
export const acceptJobByStudentID = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { studentId, task, availabilityConfirmed, note } = req.body;
    const normalizedStudentId = String(studentId || "").trim().toUpperCase();

    if (!normalizedStudentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required",
      });
    }

    if (!availabilityConfirmed) {
      return res.status(400).json({
        success: false,
        message: "Please confirm your availability before applying",
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "This job is already completed",
      });
    }

    if (job.jobSchedule && new Date(job.jobSchedule) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "This job is already scheduled in the past",
      });
    }

    if (job.acceptedStudents.length >= job.requiredStudents) {
      return res.status(400).json({
        success: false,
        message: "Job is already full",
      });
    }

    const student = await Students.findOne({ studentId: normalizedStudentId });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found. Please check you student ID or register first.",
      });
    }

    if (student.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Only approved students can accept jobs",
      });
    }

    if (!student.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your account before accepting jobs",
      });
    }

    // if (!student.isEmailVerified) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Please verify your email before accepting jobs",
    //   });
    // }

    // check if student already accepted the job
    const alreadyAccepted = job.acceptedStudents.find(
      (s) => String(s.studentId || "").toUpperCase() === normalizedStudentId,
    );

    if (alreadyAccepted) {
      return res.status(400).json({
        success: false,
        message: "Student already accepted this job",
      });
    }

    const selectedTask = task && job.workType.includes(task) ? task : job.workType[0];

    job.acceptedStudents.push({
      studentId: normalizedStudentId,
      name: student.name,
      email: student.email,
      phone: student.phone,
      college: student.college,
      task: selectedTask,
      availabilityConfirmed: true,
      note: String(note || "").trim(),
      acceptedAt: new Date(),
    });

    job.status =
      job.acceptedStudents.length >= job.requiredStudents
        ? "filled"
        : "partially-filled";

    await job.save();
    await Students.updateOne(
      { studentId: normalizedStudentId },
      { isActive: false },
    );

    const updatedJob = await Job.findById(jobId).populate(
      "acceptedStudents",
      "name email phone",
    );

    const io = req.app.get("io");

    io.emit("job:studentAccepted", {
      jobId: updatedJob._id,
      quoteId: updatedJob.quoteId,
      status: updatedJob.status,
      acceptedStudents: updatedJob.acceptedStudents,
      acceptedCount: updatedJob.acceptedStudents.length,
      requiredStudents: updatedJob.requiredStudents,
      remainingSlots: Math.max(
        updatedJob.requiredStudents - updatedJob.acceptedStudents.length,
        0,
      ),
      data: updatedJob,
    });

    return res.json({
      success: true,
      message: "Job accepted successfully",
      data: updatedJob,
    });
  } catch (err) {
    console.error("Error accepting job:", err);
    res.status(500).json({
      success: false,
      message: "Failed to accept job",
    });
  }
};

// export const updateJobStatus = async (req, res) => {
//   try {
//     const { quoteId } = req.params;
//     const { status } = req.body;

//     const job = await Job.findByIdAndUpdate(quoteId, { status }, { new: true });

//     if (!job) {
//       return res.status(404).json({
//         success: false,
//         message: "Job not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: job,
//     });
//   } catch (error) {
//     console.error("Update job error: ", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to update job",
//     });
//   }
// };
