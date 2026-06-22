import mongoose, { Schema, Document, ObjectId } from "mongoose";
import { getNextSequence } from "./helpers/increment";

export interface INote extends Document {
  userId: ObjectId;
  title: string;
  text: string;
  ticketId: number;
  isCompleted: boolean;
}

const noteSchema = new Schema<INote>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    title: {
      type: String,
      required: true,
      unique: true
    },
    text:{
      type: String,
      required: true
    },
    ticketId: {
      type: Number,
      unique: true
    },
    isCompleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

noteSchema.pre<INote>("save", async function () {
    if (!this.isNew) return;

    this.ticketId = await getNextSequence("ticketId");
})

export default mongoose.model<INote>("Note", noteSchema);