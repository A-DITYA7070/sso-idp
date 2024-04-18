import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { ServiceProvider } from "../models/service-provider.models.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendToken } from "../utils/sendToken.js";
import { User } from "../models/user.model.js";


const register = catchAsyncError(async(req, res, next) => {
    const {
        serviceProviderName,
        email,
        password,
        username
    } = req.body;

    if (!email || !password || !username || !serviceProviderName) {
        return next(new ErrorHandler("Bad Request", 400));
    }

    let existUser = await User.findOne({email});
    let existemail = await ServiceProvider.findOne({email});
    let username1 = await ServiceProvider.findOne({username});
    let username2 = await User.findOne({username});

    if(existUser || existemail || username1 || username2){
        return next(new ErrorHandler("User already exist ",400));
    }
    
    const serviceProvider = new ServiceProvider({
            serviceProviderName,
            email,
            password,
            username,
    });
    const CLIENT_ID = serviceProvider.generateclientID(serviceProviderName);
    const CLIENT_SECRET = serviceProvider.generateClientSecret(username);

    let sp = await ServiceProvider.findOne({ email });
    if (sp) {
        return next(new ErrorHandler("Already registered", 400));
    }
    sp = await serviceProvider.save();
    res.status(200).json({
        success: true,
        sp
    });      
});

const login = catchAsyncError(async(req,res,next) => {
    const {email,password} = req.body;
    if(!email || !password)return next(new ErrorHandler("Bad request ",400));
    const sp = await ServiceProvider.findOne({email}).select("+password");
    if(!sp){
        return next(new ErrorHandler("Not Registered",401));
    }
    const isMatch = await sp.comparepassword(password);
    if(!isMatch)return next(new ErrorHandler("Wrong credentials ",401));
    sendToken(res,sp,`welocome back ${sp.username}!!`,200);
});


const getclientIdAndSecret = catchAsyncError(async(req,res,next) => {
    const user = await ServiceProvider.findById(req.user._id);
    if(!user)return next(new ErrorHandler("UnAuthorised ",401));
    const client_id = user.CLIENT_ID;
    const client_secret = user.CLIENT_SECRET;

    const data = {
        "CLIENT_ID":client_id,
        "CLIENT_SECRET":client_secret
    }
  
    res.status(200).json({
        success:true,
        data
    });  
})


export {
    register,
    login,
    getclientIdAndSecret
};