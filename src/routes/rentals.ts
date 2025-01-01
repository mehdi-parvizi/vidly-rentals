import express, { Request, Response } from "express";
import { createRental, getRentals } from "../db/models/rental.ts";
import { validate } from "../middleware/validateBody.ts";
import schema from "../schemas/returnSchema.ts";

const router = express.Router();

router.get("/", async (req, res) => {
  const rentals = await getRentals();
  res.send(rentals);
});

router.post(
  "/",
  validate(schema),
  async (
    req: Request<{}, {}, { customerId: string; movieId: string }>,
    res: Response
  ) => {
    const { customerId, movieId } = req.body;
    const rental = await createRental(customerId, movieId);
    if (!rental) {
      res.status(400).send("was not found");
      return;
    }
    res.send(rental);
  }
);

export default router;
