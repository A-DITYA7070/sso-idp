import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    name:{
        type:String,
        required:[true,"Name is required "],
        minLength:[3,"Min length is 3 "]
    },
    email:{
        type:String,
        required:[true,"Email is required "],
        unique:[true,"User already exists "]
    },
    password:{
        type:String,
        required:[true,"Password is required "],
        select:false
    },
    role:{
        type:String,
        default:"user"
    },
    username:{
        type:String,
        required:[true,"username is required "],
        unique:[true,"Username already taken"]
    }
},{timestamps:true});



userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    const hashedPassword=await bcrypt.hash(this.password,10);
    this.password=hashedPassword;
    next();
});

userSchema.methods.comparepassword = async function(password){
    return await bcrypt.compare(password,this.password);
 }

userSchema.methods.getjwtToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            role:"user",
            username:this.username
        },
        process.env.JWT_SECRET,
        {expiresIn:"15d"}
    ).toString();
}


export const User = mongoose.model("User",userSchema);

