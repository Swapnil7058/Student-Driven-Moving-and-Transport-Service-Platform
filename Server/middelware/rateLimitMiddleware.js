import rateLimit from "express-rate-limit";

export const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message:{
        success: false,
        message: "Too Many registration attempts. Try again later",
    },
});
