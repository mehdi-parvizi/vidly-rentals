import express, { Application } from "express";
import error from "../middleware/error.ts";
import auth from "../routes/auth.ts";
import customers from "../routes/customers.ts";
import genres from "../routes/genres.ts";
import movies from "../routes/movies.ts";
import rentals from "../routes/rentals.ts";
import users from "../routes/users.ts";
import returns from "../routes/returns.ts";

export default (app: Application) => {
  app.use(express.json());
  app.use("/api/genres", genres);
  app.use("/api/customers", customers);
  app.use("/api/movies", movies);
  app.use("/api/rentals", rentals);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/returns", returns);
  app.use(error);
};
