import express, { Request, Response } from "express";
import asyncMiddleware from "../middleware/async.ts";
import { auth } from "../middleware/auth.ts";
import { updateRental } from "../db/models/rental.ts";
import { validate } from "../middleware/validateBody.ts";
import returnSchema from "../schemas/returnSchema.ts";

// This feature was developed using TDD method

const router = express.Router();

interface ClientResponse {
  customerId: string;
  movieId: string;
}

router.post(
  "/",
  auth,
  validate(returnSchema),
  asyncMiddleware(
    async (req: Request<{}, {}, ClientResponse>, res: Response) => {
      const { customerId, movieId } = req.body;
      const result = await updateRental(customerId, movieId);
      if (result.status === 200) {
        res.status(200).send(result.rental);
      } else {
        res.status(result.status).send(result.message);
      }
    }
  )
);

export default router;
