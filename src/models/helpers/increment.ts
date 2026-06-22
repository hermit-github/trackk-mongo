// utils/getNextSequence.ts

import { Counter } from "../counter";

export const getNextSequence = async (
  sequenceName: string
): Promise<number> => {
  const counter = await Counter.findByIdAndUpdate(
    sequenceName,
    { $inc: { seq: 1 } },
    {
      new: true,
      upsert: true,
    }
  );

  return counter.seq;
};