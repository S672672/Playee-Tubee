import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessTokenAndRefreshTokens = async(userId){
  try{
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave : false })

return {accessToken,refreshToken}

  }catch(error){
    throw new ApiError(500,"something went wrong while generating refresh and access token")
  }
} 


const registerUser = asyncHandler(async (req, res) => {
  //get user detail from frontend
  //validation --if it is empty
  //check if user already exists
  //check for images,check for avatar
  //upload them to cloudinary,avatar
  //create user object --create entry in db
  //remove password and refresh token field from response
  //check for user creation
  //return response

  const { fullName, email, username, password } = req.body;

  if (
    [fullName, email, username, password].some((field) => {
      field?.trim() === "";
    })
  )
   {
    throw new ApiError(400, "All fields are required");
  }
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if(existedUser){
    throw new ApiError(409,'User with email or username already exists')
  }
  console.log(req.files)
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImagePath = req.files?.coverImage[0]?.path;

  let coverImagePath;
  if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
  coverImagePath = req.files.coverImage[0].path
  }

  if(!avatarLocalPath){
    throw new ApiError(400,'Avatar file is required')
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImagePath)
  if(!avatar){
    throw new ApiError(400,"avatar image is required")
  }

  const user = await User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url || '',
    email,
    password,
    username:username.toLowerCase()
  })

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )
  if(!createdUser){
    throw new ApiError(500,'Something went wrong while registering the user')
  }
  return res.status(201).json(
    new ApiResponse(200,createdUser,"user registered Successfully")
  )
});

const loginUser = asyncHandler(async(req,res)=>{
  //req body -> data
  //username or email
  //find the user
  //check password
  //access and refresh token generation
  //send cookie

  const {email,username,password} = req.body

  if{!username !! !email}{
    throw new ApiError(400,"username or password is required")
  
  }

  const user = await User.findOne({
    $or:[{username},{email}]
  })

  if(!user){
    throw new ApiError(404,"User doesn't exist")
  }

  const isPasswordValid = await user.isPasswordCorrect()password

  if(!isPasswordValid){
    throw new ApiError(401,"Invalid user credentials")
  }

  const {accessToken,refreshToken} = await generateAccessTokenAndRefreshTokens(user._id)

})
export { registerUser };
