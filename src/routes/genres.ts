import {
  createGenre,
  deleteGenre,
  getGenre,
  getGenres,
  updateGenre,
} from "../db/models/genre.ts";
import { auth } from "../middleware/auth.ts";
import express from "express";
import { Schema, Types } from "mongoose";
import { validate } from "../middleware/validateBody.ts";
import schema from "../schemas/genreSchema.ts";
import admin from "../middleware/admin.ts";
import asyncMiddleware from "../middleware/async.ts";
import validateObjectId from "../middleware/validateObjectId.ts";

const router = express.Router();

router.get(
  "/",
  asyncMiddleware(async (req, res, next) => {
    const genres = await getGenres();
    res.send(genres);
  })
);

router.get("/:id", validateObjectId, async (req, res) => {
  if (!Types.ObjectId.isValid(req.params.id)) {
    res.status(404).send("Invalid ID");
    return;
  }
  const genre = await getGenre(req.params.id);
  if (!genre) {
    res.status(404).send("Requested genre does not exist");
    return;
  }
  res.send(genre);
});

router.post("/", auth, validate(schema), async (req, res) => {
  const {
    body: { name },
  } = req;
  const newGenre = await createGenre(name);

  if (!newGenre) {
    res.status(404).send("Requested genre does not exist");
    return;
  }
  res.send(newGenre);
});

router.put("/:id", validate(schema), async (req, res) => {
  const {
    body: { name },
  } = req;
  const genre = await updateGenre(
    req.params.id as unknown as Schema.Types.UUID,
    name
  );
  if (!genre) {
    res.status(404).send("Requested genre does not exist");
    return;
  }
  res.status(201).send(genre);
});

router.delete("/:id", auth, admin, validateObjectId, async (req, res) => {
  const result = await deleteGenre(req.params.id);
  if (!result) {
    res.status(404).send("Requested genre does not exist");
    return;
  }
  res.send(result);
});

export default router;
