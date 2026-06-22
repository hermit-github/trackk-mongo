import mongoose, { Schema, Document } from "mongoose";
import { USER_ROLES } from "../utils";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  roles: string[];
  isActive: boolean;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password:{
      type: String,
      required: true
    },
    roles:[{
      type: String,
      default: USER_ROLES.EMPLOYEE,
    }],
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IUser>("User", UserSchema);