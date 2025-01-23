// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   isVerified: { 
//     type: Boolean, 
//     default: false 
//   },
//   verificationToken: { 
//     type: String, 
//     default: null 
//   },
//   verificationTokenExpires: { 
//     type: Date, 
//     default: null // You can use this to set an expiry time for the token
//   },
// });

// // Hash password before saving
// userSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//   }
//   next();
// });

// export default mongoose.models.User || mongoose.model("User", userSchema);
import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: false,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    // required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  verificationToken: { 
    type: String, 
    default: null 
  },
  verificationTokenExpires: { 
    type: Date, 
    default: null // Optionally set an expiry time for the token
  },
  verificationTokenUsed: {
    type: Boolean,
    default: false,
  },
});


export default mongoose.models.User || mongoose.model("User", userSchema);
