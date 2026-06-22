
import mongoose,{ Schema, model, Document } from "mongoose";

export interface ICounter extends Document {
  seq: number;
}

const counterSchema = new Schema<ICounter>({
  seq: { type: Number, default: 0 },
});

export const Counter = mongoose.model<ICounter>("Counter", counterSchema);