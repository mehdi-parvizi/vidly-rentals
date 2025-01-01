import { Document, Model, model, Schema, startSession, Types } from "mongoose";
import { Customer } from "./customer.ts";
import { Movie } from "./movie.ts";
import moment from "moment";

interface Rental extends Document {
  customer: { name: string; isGlod: boolean; phone: string };
  movie: { title: string; dailyRentalFee: number };
  dateOut: Date;
  dateReturned: Date;
  rentalFee: number;
  return: () => void;
}

interface Methods extends Model<Rental> {
  lookup: (customerId: string, movieId: string) => Promise<Rental | null>;
}

const rentalSchema = new Schema(
  {
    customer: {
      type: new Schema({
        name: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 50,
        },
        isGold: {
          type: Boolean,
          default: false,
        },
        phone: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 50,
        },
      }),
      required: true,
    },
    movie: {
      type: new Schema({
        title: {
          type: String,
          required: true,
          trim: true,
          minlength: 5,
          maxlength: 255,
        },
        dailyRentalRate: {
          type: Number,
          required: true,
          min: 0,
          max: 255,
        },
      }),
      required: true,
    },
    dateOut: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dateReturned: {
      type: Date,
    },
    rentalFee: {
      type: Number,
      min: 0,
    },
  },
  {
    methods: {
      return() {
        this.dateReturned = new Date();

        const rentalDays = moment().diff(this.dateOut, "days");
        this.rentalFee = rentalDays * (this.movie.dailyRentalRate as number);
      },
    },
    statics: {
      lookup: function (customerId, movieId) {
        return this.findOne({
          "customer._id": customerId,
          "movie._id": movieId,
        });
      },
    },
  }
);

export const Rental = model<Rental, Methods>("Rental", rentalSchema);

export type RentalModelType = typeof Rental;

export const createRental = async (customerId: string, movieId: string) => {
  const session = await startSession();
  session.startTransaction();
  try {
    const customer = await Customer.findById(customerId);
    if (!customer) throw new Error("Invalid customer");
    const movie = await Movie.findById(movieId);
    if (!movie) throw new Error("Invalid movie");
    if (movie.numberInStock === 0) throw new Error("Out of stock");
    const rental = new Rental({
      customer,
      movie,
    });
    await rental.save({ session });

    movie.numberInStock--;
    await movie.save({ session });
    await session.commitTransaction();
    console.log("commited succesfully");
    return rental;
  } catch (err) {
    session.abortTransaction();
    console.log(err);
    return (err as Error).message;
  } finally {
    await session.endSession();
  }
};

export const getRentals = async () => {
  try {
    const rentals = await Rental.find();
    console.log(rentals);
    return rentals;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updateRental = async (customerId: string, movieId: string) => {
  const session = await startSession();
  session.startTransaction();
  try {
    if (
      !Types.ObjectId.isValid(customerId) ||
      !Types.ObjectId.isValid(movieId)
    ) {
      return { status: 400, message: "Invalid customerId or movieId" };
    }

    if (!customerId || !movieId) {
      return { status: 400, message: "customerId or movieId was not provided" };
    }

    const rental = await Rental.lookup(customerId, movieId);

    if (!rental) {
      return { status: 404, message: "Rental was not found" };
    }

    if (rental.dateReturned) {
      return { status: 400, message: "Rental already processed" };
    }
    rental.return();
    await rental.save();

    await Movie.findByIdAndUpdate(movieId, {
      $inc: { numberInStock: 1 },
    });

    await session.commitTransaction();
    return { status: 200, rental };
  } catch (err) {
    await session.abortTransaction();
    return { status: 500, message: (err as Error).message };
  } finally {
    await session.endSession();
  }
};
