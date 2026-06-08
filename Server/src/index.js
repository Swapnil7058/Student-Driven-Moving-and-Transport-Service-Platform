import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import { Server } from "socket.io";

import quoteRoutes from "../routes/quote.route.js";
import connectDB from "../config/database.js";
import contactRoutes from "../routes/contact.route.js";
import jobRoutes from "../routes/job.route.js";
import authRoutes from "../routes/auth.route.js";
import studentRouter from "../routes/student.route.js";

connectDB();

const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100000,
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/contact", contactRoutes);

app.use("/api/students", studentRouter);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: FRONTEND_URL,
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket)=>{
  console.log("Socket connected:", socket.id);

  socket.on("disconnect", ()=>{
  console.log("Server disconnected:", socket.id);
});
});



httpServer.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
