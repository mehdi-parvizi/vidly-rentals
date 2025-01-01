import { z } from "zod";

const schema = z.object({
  title: z.string().min(1).max(255),
  numberInStock: z.number().min(0).max(255),
  dailyRentalRate: z.number().min(0).max(255),
  genreId: z.string().min(1).max(255),
});

export default schema;
