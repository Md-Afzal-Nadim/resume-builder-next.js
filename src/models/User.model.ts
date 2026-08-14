import mongoose from "mongoose";
import { IUser } from "@/types/user.type";
import bcrypt from "bcrypt"



interface UserDocument extends Omit<IUser, "_id">,Document {
  comparePassword(candidatepassword: string): boolean
}



const userSchema = new mongoose.Schema<UserDocument>({
  name: {
    type: String,
    trim: true,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    trim: true,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  mobile: {
    type: String,
    required: [true, "Mobile number is required"],
    minlength: [10, "Mobile number must be at least 10 digits"],
    maxlength: [10, "Mobile number must be at most 10 digits"],   
  }
},{
  timestamps: true,
});

userSchema.pre("save", function() : void {
  if(!this.isModified("password")) return;
  this.password = bcrypt.hashSync(this.password, 10);
})

userSchema.methods.comparePassword = function (candidatepassword: string): boolean {
  return bcrypt.compareSync(candidatepassword, this.password);
}


const UserModel =
  mongoose.models.User || mongoose.model("User", userSchema);

export default UserModel
/*const UserModel = mongoose.model<UserDocument>("User", userSchema);
export default UserModel*/

