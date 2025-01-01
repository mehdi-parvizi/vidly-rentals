import { Schema, model, connect } from "mongoose";
import { Genre, genreSchema } from "./genre.ts";

interface Movie {
  title: string;
  numberInStock: number;
  genreId: string;
  dailyRentalRate: number;
}

export const movieSchema = new Schema<Movie>({
  title: { type: String, required: true },
  genreId: genreSchema,
  numberInStock: { type: Number, required: true },
  dailyRentalRate: { type: Number, required: true },
});

export const Movie = model("Movie", movieSchema);

export const createMovie = async ({
  title,
  numberInStock,
  genreId,
  dailyRentalRate,
}: Movie) => {
  try {
    let genre = await Genre.findOne({ _id: genreId });
    if (!genre) throw new Error("Requested genre does not exist");
    const movie = new Movie({
      dailyRentalRate,
      numberInStock,
      title,
      genreId: { _id: genre._id, name: genre.name },
    });
    const savedMovie = await movie.save();
    return savedMovie;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const getMovie = async (id: string) => {
  try {
    const movie = await Movie.find({ _id: id });
    return movie;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const getMovies = async () => {
  return await Movie.find();
};

export const deleteMovie = async (id: string) => {
  try {
    const movie = await Movie.findByIdAndDelete({ _id: id });
    return movie;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const updateMovie = async ({
  dailyRentalRate,
  genreId,
  numberInStock,
  title,
  id,
}: Movie & { id: string }) => {
  try {
    const genre = await Genre.findOne({ _id: genreId });
    if (!genre) throw new Error("Genre was not found");
    const movie = await Movie.findByIdAndUpdate(
      id,
      {
        title,
        genreId: genre,
        dailyRentalRate,
        numberInStock,
      },
      { new: true }
    );
    return movie;
  } catch (err) {
    console.log(err);
    return err;
  }
};

// Example usage

// updateMovie({
//   id: "676486889ee952bcb0d7b5b0",
//   title: "Terminator",
//   dailyRentalRate: 1,
//   numberInStock: 2,
//   genreId: "6763dec28ce21ff72cf8182b",
// });

// createMovie({
//   title: "Terminator",
//   dailyRentalRate: 2,
//   numberInStock: 5,
//   genreId: "6763e3c2cc2006b14b0af9b3",
// });
