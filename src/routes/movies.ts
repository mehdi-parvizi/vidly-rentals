import express from "express";
import { validate } from "../middleware/validateBody.ts";
import schema from "../schemas/movieSchema.ts";
import {
  createMovie,
  deleteMovie,
  getMovie,
  getMovies,
  updateMovie,
} from "../db/models/movie.ts";

const router = express.Router();

router.get("/", async (req, res) => {
  const movies = await getMovies();
  res.send(movies);
});

router.get("/:id", async (req, res) => {
  const movie = await getMovie(req.params.id);
  if (!movie) {
    res.status(404).send("Requested genre does not exist");
    return;
  }
  res.send(movie);
});

router.post("/", validate(schema), async (req, res) => {
  const { body } = req;
  const newMovie = await createMovie(body);
  if (!newMovie) {
    res.status(404).send("Requested genreee does not exist");
    return;
  }
  res.send(newMovie);
});

router.post("/:id", validate(schema), async (req, res) => {
  const { body } = req;
  const movie = await createMovie(body);
  if (!movie) {
    res.status(404).send("Requested genre does not exist");
    return;
  }
  res.send(movie);
});

router.put("/:id", validate(schema), async (req, res) => {
  const { body } = req;
  const movie = await updateMovie({ id: req.params.id, ...body });
  if (!movie) {
    res.status(404).send("Requested genre does not exist");
    return;
  }
  res.status(201).send(movie);
});

router.delete("/:id", async (req, res) => {
  const result = await deleteMovie(req.params.id);
  if (!result) {
    res.status(404).send("Requested genre does not exist");
    return;
  }
  res.send(result);
});

export default router;
