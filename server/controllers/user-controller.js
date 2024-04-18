import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import {User} from "../models/user.model.js";
import { ServiceProvider } from "../models/service-provider.models.js";
import { sendToken } from "../utils/sendToken.js";
import jwt from "jsonwebtoken";

const register = catchAsyncError(async(req,res,next)=>{
    const {
        name,
        username,
        password,
        email
    }=req.body;

    if(!name || !username || !password || !email){
        return next(new ErrorHandler("Bad request ",400));
    }

    let existUser = await User.findOne({email});
    let existemail = await ServiceProvider.findOne({email});
    let username1 = await ServiceProvider.findOne({username});
    let username2 = await User.findOne({username});

    if(existUser || existemail || username1 || username2){
        return next(new ErrorHandler("User already exist ",400));
    }

    const user = await User.create({
        name,
        username,
        password,
        email
    });
    
    res.status(201).json({
        success:true,
        user
    })
});


const login = catchAsyncError(async(req,res,next) => {
    const {username,password,email}=req.body;
    if(!username && !email || !password){
        return next(new ErrorHandler("Bad request ",400));
    }
    let user;
    if(username){
        user = await User.findOne({username}).select("+password");
    }
    if(email){
        user = await User.findOne({email}).select("+password");
    }
    const isMatch = await user.comparepassword(password);

    if(!isMatch){
        return next(new ErrorHandler("Wrong credentials ",401));
    }

    sendToken(res,user,`welcome back ${user.username}`,200);
})

const loginVerify = catchAsyncError(async(req,res,next)=>{

    const {email,password,CLIENT_ID,username} = req.body;

    if(!email || !password || !CLIENT_ID){
        return next(new ErrorHandler("Login failed ",400));
    }
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Not found ",404));
    }
    const isMatch = await user.comparepassword(password);
    if(!isMatch){
        return next(new ErrorHandler("Wrong Credentials ",401));
    }
    const company = await ServiceProvider.findOne({CLIENT_ID});
    if(!company){
        return next(new ErrorHandler("Internal server error ----",500));
    }

    const token = jwt.sign(
        {
            id:user.id,
            username:username,
            email:user.email
        },
        company.CLIENT_SECRET,
        {expiresIn:"15d"}
    ).toString();

    res.status(200).json({
        success:true,
        token:token
    })

})


export {
    register,
    login,
    loginVerify
}