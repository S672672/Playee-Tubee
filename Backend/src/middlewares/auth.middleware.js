import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from "../utils/ApiResponse.js"
import jwt from 'jsonwebtoken'
import {User} from "../models/user.models.js"

export const verifyJWT = asyncHandler(async(req,res,next)=>{
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")

    if(!token){
        throw new ApiError(401,"unauthorized request")
    }
    const decodedToken = await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodedToken?.id).select("-password -refreshToken")

    if(!user){
        throw new ApiError(401,"Invalid Access TOken")
    }
    req.user = user;
    next()
})