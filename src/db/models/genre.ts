import { Schema, Types, model } from "mongoose";

export const genreSchema = new Schema({
  name: Schema.Types.String,
});

export const Genre = model("Genre", genreSchema);

export const getGenre = async (id: string) => {
  try {
    const result = await Genre.find({ _id: id });
    return result;
  } catch (err) {
    throw err;
  }
};

export const getGenres = async () => {
  try {
    const genres = await Genre.find();
    return genres;
  } catch (err) {
    return err;
  }
};

export const createGenre = async (name: string) => {
  try {
    const genre = new Genre({
      name: name,
    });
    const result = await genre.save();
    return result;
  } catch (err) {
    return err;
  }
};

export const updateGenre = async (id: any, name: string) => {
  try {
    const result = await Genre.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
        },
      },
      { new: true }
    );
    return result;
  } catch (err) {
    return err;
  }
};

export const deleteGenre = async (id: any) => {
  try {
    const result = await Genre.findByIdAndDelete(id);
    return result;
  } catch (err) {
    return err;
  }
};
