import { NextFunction, Request, Response } from "express";
import { ZodSchema, z } from "zod";

export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Parse the request body
      req.body = schema.parse(req.body);
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Respond with validation error
        console.log(error);
        res.status(400).send(error.issues[0].message);
      } else {
        // Unexpected error
        next(error); // Pass error to Express error handler
      }
    }
  };
