import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/aysncHandler.js";
import jwt from "jsonwebtoken"

export const verifyJWT=asyncHandler(async(req,res,next)=>{
   try {
     const token=await req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
 
     if(!token){
         throw new ApiError(401,"Unauthorized access")
 
     }
     const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
     const user=await User.findById(decodedToken?._id).select(
         "-password -refreshToken"
     )  
     if(!user){
         throw new ApiError(401,"Invalid access token")
 
     }
     req.user=user  //user ka acces de diya
     next()                 
   } catch (error) {
    
        throw new ApiError(401,error?.message || "Invalid access token")
   }

})

export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

export const librarian = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'librarian')) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as a librarian' });
    }
};




