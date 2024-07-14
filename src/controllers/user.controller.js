
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/aysncHandler.js";
import { ApiError } from "../utils/ApiError.js";

import jwt from "jsonwebtoken"

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}


const registerUser=asyncHandler(async(req,res)=>{
       //get user details from frontend
       //validation-not empty
       //check if user already exist:username,email
       //check for images,check for avatar
       //upload to cloudinary
       //create user object
       //remove password and refresh token field from response 
       //check for user creation
       //return res
      const {email,password,username,role}=req.body;

      if(
        [email,password,username,role].some((field)=>field?.trim()==="")

      ){
        throw new ApiError(400,"All the fields are required")
      }

      const existedUser=await User.findOne(
        {
            $or:[{username},{email}]
        }
      )
      if(existedUser){
        throw new ApiError(409,"User with email or username already exists");

      }
    

       const user=await User.create({
        email,
        password,
        username:username.toLowerCase(),
        role


       })

       const createUser=await User.findById(user._id).select(
        "-password -refreshtoken"
       )

       if(!createUser){
        throw new ApiError(500, "Something went wrong while registering the user")
       }

       return res.status(201).json(
        new ApiResponse(200, createUser, "User registered Successfully")
    )

})

const loginUser = asyncHandler(async (req, res) =>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {email,password} = req.body
    
    console.log(email);

    if (!email) {
        throw new ApiError(400, "username or email is required")
    }
    
    // Here is an alternative of above code based on logic discussed in video:
    // if (!(username || email)) {
    //     throw new ApiError(400, "username or email is required")
        
    // }

    const user = await User.findOne({
     email
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }

   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})


const logoutUser=asyncHandler(async(req,res)=>{
        await User.findByIdAndUpdate(
           req.user._id,
           {
             $unset:{  //update 
                refreshToken:1
             }
           } ,

           {
            new:true,
           }
        )

        
     const options={
        httpOnly:true,
        secure:true,

     }
     return res.status(200)
     .clearCookie("accessToken",options)
     .clearCookie("refreshtoken",options)
     .json(new ApiResponse(200,{},"User Logged out "))

})

const refreshAccessToken=asyncHandler(async(req,res)=>{
   const incomingRefreshToken=await req.cookies.refreshToken || req.body.refreshToken

   if(!incomingRefreshToken){
    throw new ApiError(401,"Unauthorized Request")

   }

  try {
     const decodedToken=jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
     )
  
    const user=await User.findById(decodedToken?._id)
  
    if(!user){
      throw new ApiError(401,"Invalid refresh Token")
  
    }
    if(incomingRefreshToken!==user?.refreshToken){
      throw new ApiError(401,"Refresh token is expired or Used")
    }
    const options={
      httpOnly:true,
      secure:true,
    }
    const {accessToken,newRefreshToken}=await generateAccessAndRefereshTokens(user._id)
    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",newRefreshToken,options)
    .json(
      new ApiResponse(
         200,
         {accessToken,refreshToken:newRefreshToken},
         "Access token refreshed"
         
  
      )
    )
  } catch (error) {
          throw new ApiError(401,error?.message || "Invalid refresh token")    
    
  }
})




export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
}