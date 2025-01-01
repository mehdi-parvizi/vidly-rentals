import { z } from "zod";

const schema = z.object({
  name: z.string(),
  phone: z.string(),
  isGold: z.boolean(),
});

export default schema;
