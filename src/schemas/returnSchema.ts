import { z } from "zod";
import mongoose from "mongoose";

const schema = z.object({
  customerId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "Invalid customerId",
  }),
  movieId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "Invalid movieId",
  }),
});

export default schema;
