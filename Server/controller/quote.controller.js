import Quote from "../models/quotes.models.js";
import { getDistanceKm, getLocationFromZip } from "../utils/locationService.js";

const canAccessQuote = (req, quote) =>
  req.user?.role === "admin" || req.user?.email === quote?.email;

const emitQuoteChanged = async (req, quote) => {
  const io = req.app.get("io");
  if (!io || !quote) return;

  io.emit("quote:changed", {
    quoteId: quote._id,
    email: quote.email,
    status: quote.status,
  });
};

export const createQuote = async (req, res) => {
  try {
    const { zipFrom, zipTo } = req.body;

    // Get location data
    const from = await getLocationFromZip(zipFrom);
    const to = await getLocationFromZip(zipTo);

    // Calculate distance
    const distance = await getDistanceKm(from, to);

    const quote = await Quote.create({
      ...req.body,

      fromLocation: from.name,
      toLocation: to.name,

      distanceKm: distance,

      fromCoordinates: {
        lat: from.lat,
        lng: from.lng,
      },

      toCoordinates: {
        lat: to.lat,
        lng: to.lng,
      },
    });

    emitQuoteChanged(req, quote);

    res.status(201).json({
      success: true,
      message: "Quote received successfully",
      data: quote,
    });
  } catch (error) {
    console.error("Create quote error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ***********************************************************************************************************
// ***********************************************************************************************************
// ***********************************************************************************************************
export const getJobStats = async (req, res) => {
  try {
    const totalJobs = await Quote.countDocuments({
      status: { $in: ["completed", "in-progress"] },
    });
    const pending = await Quote.countDocuments({ status: "pending" });

    const inProgress = await Quote.countDocuments({ status: "in-progress" });
    const completed = await Quote.countDocuments({
      status: "completed",
    });

    const revenueAgg = await Quote.aggregate([
      { $match: { status: "completed", "invoice.total": { $exists: true } } },
      { $group: { _id: null, totalRevenue: { $sum: "$invoice.total" } } },
    ]);

    const revenue = revenueAgg[0]?.totalRevenue || 0;

    res.json({
      success: true,
      data: {
        totalJobs,
        pending,
        inProgress,
        completed,
        revenue,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch job stats",
    });
  }
};

export const getAllQuotes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || "all";
    const search = req.query.search || "";

    let filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    // search filter
    if (search.trim() !== "") {
      filter.$or = [
        { fullName: { $regex: search.trim(), $options: "i" } },
        { email: { $regex: search.trim(), $options: "i" } },
        { phone: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const quotes = await Quote.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await Quote.countDocuments(filter);

    console.log("STATUS:", status);
    console.log("FILTER:", filter);
    res.json({
      success: true,
      page,
      pages: Math.ceil(total / limit),
      total,
      data: quotes,
    });
  } catch (error) {
    console.error("Quote fetch error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch quotes",
    });
  }
};

export const getQuoteById = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) {
      return res.status(404).json({
        success: false,
        message: "Quote not found",
      });
    }

    if (!canAccessQuote(req, quote)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    return res.status(200).json({
      success: true,
      data: quote,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch quote",
    });
  }
};

export const updateQuote = async (req, res) => {
  try {
    const quote = await Quote.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: "Quote not found",
      });
    }

    emitQuoteChanged(req, quote);

    res.status(200).json({
      success: true,
      message: "Quote updated successfully",
      data: quote,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to Update quote",
    });
  }
};

export const getQuoteByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    // email validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (req.user?.role !== "admin" && req.user?.email !== email) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    const quotes = await Quote.find({ email }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: quotes.length,
      data: quotes,
    });
  } catch (error) {
    console.error("❌ Fetch quotes error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch quotes",
    });
  }
};

export const respondToQuote = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!["confirmed", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer response",
      });
    }

    const quote = await Quote.findById(req.params.id);
    if (!quote) {
      return res.status(404).json({
        success: false,
        message: "Quote not found",
      });
    }

    if (!canAccessQuote(req, quote)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    if (quote.status !== "quoted") {
      return res.status(400).json({
        success: false,
        message: "Only quoted requests can be accepted or rejected",
      });
    }

    quote.status = status;
    if (status === "rejected") {
      quote.rejectionReason = String(rejectionReason || "").trim();
    }
    await quote.save();

    emitQuoteChanged(req, quote);

    return res.json({
      success: true,
      message: `Quote ${status} successfully`,
      data: quote,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to respond to quote",
    });
  }
};

export const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { services, tax } = req.body;

    if (!services) {
      return res.status(400).json({
        success: false,
        message: "Services data missing",
      });
    }

    let subtotal = 0;

    services.forEach((s) => {
      subtotal += Number(s.total || 0);
    });

    const taxAmount = subtotal * (Number(tax || 0) / 100);

    const total = subtotal + taxAmount;

    const quote = await Quote.findByIdAndUpdate(
      id,
      {
        invoice: {
          services,
          tax,
          total,
        },
        status: "quoted",
      },
      { new: true },
    );

    emitQuoteChanged(req, quote);

    return res.json({
      success: true,
      data: quote,
    });
  } catch (error) {
    console.error("Invoice update error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update invoice",
    });
  }
};
