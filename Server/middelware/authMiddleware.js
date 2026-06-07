import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


export const protect = async(req, res, next)=>{
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({message: "Not authorized"})
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch(err){
        return res.status(401).json({message: "Invalid token"})
    }
}

export const authorize = (...roles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authorized" });
    }

    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden" });
    }

    next();
};
