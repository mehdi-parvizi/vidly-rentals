import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "@jest/globals";
import { server } from "../../index.ts";
import { Rental } from "../../db/models/rental.ts";
import { Types } from "mongoose";
import { Server } from "http";
import { User } from "../../db/models/user.ts";
import request from "supertest";
import moment from "moment";
import { Movie } from "../../db/models/movie.ts";

describe("/api/returns", () => {
  let serverInstance: Server = server;
  let customerId: Types.ObjectId | string;
  let movieId: Types.ObjectId | string;
  let rental: any;
  let token: string;
  let movie: any;
  beforeAll(() => serverInstance.closeAllConnections());
  beforeEach(async () => {
    serverInstance.closeAllConnections();
    serverInstance = server;
    customerId = new Types.ObjectId();
    movieId = new Types.ObjectId();
    movie = new Movie({
      dailyRentalRate: 2,
      genreId: new Types.ObjectId(),
      numberInStock: 10,
      title: "movie title",
      _id: movieId,
    });
    await movie.save();
    token = new User().generateAuthToken();
    rental = new Rental({
      customer: {
        _id: customerId,
        name: "12345",
        isGold: false,
        phone: "12345",
      },
      movie: {
        _id: movieId,
        title: "movie title",
        dailyRentalRate: 2,
      },
    });
    await rental.save();
  });
  afterEach(async () => {
    serverInstance.closeAllConnections();
    await Rental.collection.deleteMany({});
    await Movie.collection.deleteMany({});
  });
  const exec = () =>
    request(serverInstance)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });

  it("should return 401 if client is not logged in", async () => {
    token = "";
    const response = await exec();
    expect(response.status).toBe(401);
  });

  it("should return 400 if customerId is not provided", async () => {
    customerId = "";
    const response = await exec();
    expect(response.status).toBe(400);
  });
  it("should return 400 if movieId is not provided", async () => {
    movieId = "";
    const response = await exec();
    expect(response.status).toBe(400);
  });
  it("should return 404 if no rental is found for customer/movie", async () => {
    await Rental.collection.deleteMany({});
    const response = await exec();
    expect(response.status).toBe(404);
  });
  it("should return 400 if rental is already processed", async () => {
    rental.dateReturned = new Date();
    await rental.save();
    const response = await exec();
    const result = await Rental.findOne({ _id: rental._id });
    console.log(result);
    expect(result?.dateReturned).toBeDefined();
    expect(response.status).toBe(400);
  });
  it("should set the returnDate if request is valid", async () => {
    await exec();
    const result = await Rental.findOne({
      "customer._id": customerId,
      "movie._id": movieId,
    });
    const diff = new Date().getTime() - result!.dateReturned!.getTime()!;
    expect(diff).toBeLessThan(10 * 1000);
  });
  it("should set the rentalFee if request is valid", async () => {
    rental.dateOut = moment().add(-7, "days").toDate(); // assuming the movie was rented out 7 days ago
    await rental.save();
    await exec();
    const rentalInDb = await Rental.findById(rental._id);
    expect(rentalInDb?.rentalFee).toBe(14);
  });
  it("should increase numberInStock of movie if request is valid", async () => {
    await exec();
    const movieInDb = await Movie.findById(movieId);
    expect(movieInDb?.numberInStock).toBe(movie.numberInStock + 1);
  });
  it("should return the updated rental", async () => {
    const response = await exec();
    await Rental.findById(rental._id);
    expect(Object.keys(response.body)).toEqual(
      expect.arrayContaining([
        "customer",
        "dateReturned",
        "dateOut",
        "dateOut",
        "movie",
      ])
    );
  });
});
