import mongoose,{Schema} from "mongoose";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const serviceProviderSchema = new Schema({
    serviceProviderName:{
        type:String,
        required:[true,"Please enter service provider  name "],
        minLength:[3,"Name must be atleast 3 characters long "]
    },
    email:{
        type:String,
        required:[true,"Enter email "],
        unique:[true,"Service Provider already exsits "]
    },
    password:{
        type:String,
        required:[true,"Enter your password "],
        minLength:[6,"Password must be of atleast 6 char long "],
        select:false
    },
    username:{
        type:String,
        required:[true,"Username is required "],
        unique:[true,"Username should be unique"]
    },
    role:{
        type:String,
        default:"company"
    },
    CLIENT_ID:{
        type:String
    },
    CLIENT_SECRET:{
        type:String
    }
},
{timestamps:true});

serviceProviderSchema.methods.generateRandomText = function(length){
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }
  return randomString;
}

serviceProviderSchema.methods.getjwtToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            role:"company"
        },
        process.env.JWT_SECRET,
        {expiresIn:"15d"}
    ).toString();
}

serviceProviderSchema.methods.generateclientID = function(name){
    const characters = this.generateRandomText(10);
    const time = this.timestamps;
    const serviceProviderName = name;
    const ftext = characters+time+serviceProviderName;
    const hashedText = CryptoJS.SHA256(ftext).toString();
    this.CLIENT_ID = hashedText;
    return hashedText;
}

serviceProviderSchema.methods.generateClientSecret = function(username){
    const randomText = this.generateRandomText(30);
    const time = this.timestamps;
    const ftext = randomText+username+time;
    const hashedText = CryptoJS.SHA256(ftext).toString();
    this.CLIENT_SECRET = hashedText;
    return hashedText;
}

serviceProviderSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    const hashedPassword=await bcrypt.hash(this.password,10);
    this.password=hashedPassword;
    next();
 });

 serviceProviderSchema.methods.comparepassword = async function(password){
    return await bcrypt.compare(password,this.password);
 }

export const ServiceProvider = mongoose.model("ServiceProvider",serviceProviderSchema);