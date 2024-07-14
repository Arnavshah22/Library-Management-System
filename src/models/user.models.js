import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ['admin', 'librarian', 'user'],
        default: 'user',
    },
    borrowedBooks: [
        {
            bookId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Book',
            },
            borrowedDate: {
                type: Date,
                default: Date.now,
            },
            dueDate: {
                type: Date,
                required: true,
            },
            returned: {
                type: Boolean,
                default: false,
            },
        },
    ],
    notifications: [
        {
            message: {
                type: String,
            },
            date: {
                type: Date,
                default: Date.now,
            },
            read: {
                type: Boolean,
                default: false,
            },
            refreshToken:{
                type:String,
            }
        },
    ],
}, { timestamps: true });

// Hash password before saving

UserSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next(); //if not modifies then go to next
    this.password=await bcrypt.hash(this.password,10);   //if modified then save and hash it and go to next 
    next() 

})
UserSchema.methods.isPasswordCorrect =async function(password){
  return await bcrypt.compare(password,this.password)

}

UserSchema.methods.generateAccessToken=function(){
  return jwt.sign({
      _id:this._id,
      email:this.email,
      username:this.username,
      role:this.role
  },
  process.env.ACCESS_TOKEN_SECRET,
  {
      expiresIn:process.env.ACCESS_TOKEN_EXPIRY
  }
)

}
UserSchema.methods.generateRefreshToken=function(){
  return jwt.sign({
      _id:this._id,
  },
  process.env.REFRESH_TOKEN_SECRET,
  {
      expiresIn:process.env.REFRESH_TOKEN_EXPIRY
  }
)

}
export const User = mongoose.model("User", UserSchema);
