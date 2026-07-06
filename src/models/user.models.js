import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const avatarSchema = new Schema(
    {
        url: {
            type: String,
            default: "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Picture.png",
        },
        localPath: {
            type: String,
            default: "",
        },
    },
    { _id: false }
);

const userSchema = new Schema(
    {
        avatar: {
            type: avatarSchema,
            default: () => ({
                url: "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Picture.png",
                localPath: "",
            }),
        },
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true

        },
        email:{
               type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,

        },
        fullname:{
            type:String,
            required:true,
            trim:true,
        },
        password:{
            type:String,
           required:   [true,"Password is required"],
        },
        isEmailVerified:{
            type:Boolean,
            default:false
        },
        refreshToken:{
            type:String,
        },
        forgotPasswordToken:{
            type:String,
        },
        forgotPasswordTokenExpiry:{
            type:Date,
        },
        emailVerificationToken:{
            type:String,
        },
        emailVerificationTokenExpiry:{
            type:Date,
        },
    },
    {
        timestamps:true,
    }
)

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordcorrect = async function (password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken = function (){
  return   jwt.sign({
        _id: this._id,
        email : this.email,
    },
   process.env.ACCESS_TOKEN_SECRET,
{expiresIn:process.env.ACCESS_TOKEN_EXPIRY},
)
}

userSchema.methods.generateRefreshToken = function ()
{return jwt.sign({
    _id: this._id,
    email : this.email,
},
process.env.REFRESH_TOKEN_SECRET,
{expiresIn:process.env.REFRESH_TOKEN_EXPIRY},
)
}

userSchema.methods.generateTemporaryToken = function (){

    const unHashedToken = crypto
    .randomBytes(32)
    .toString("hex");

    const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
    .digest("hex");

    const TokenExpiry = Date
    .now() + 10 * 60 * 1000;

    return { unHashedToken, hashedToken, TokenExpiry };
}


export const User = mongoose.model("User", userSchema);