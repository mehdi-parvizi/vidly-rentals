import { Genre } from "../../db/models/genre.ts";
import { server } from "../../index.ts";
import request from "supertest";
import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  beforeAll,
} from "@jest/globals";
import { User } from "../../db/models/user.ts";
import { Server } from "http";

describe("/api/genres", () => {
  let serverInstance: Server = server;
  beforeAll(() => serverInstance.closeAllConnections());
  beforeEach(async () => {
    serverInstance.closeAllConnections();
    serverInstance = server;
  });
  afterEach(async () => {
    serverInstance.closeAllConnections();
    await Genre.collection.deleteMany({});
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);
      const response = await request(serverInstance).get("/api/genres");
      expect(response.status).toBe(200);
      expect(response.body.map((g: { name: string }) => g.name)).toEqual([
        "genre1",
        "genre2",
      ]);
    });
  });

  describe("GET /:id", () => {
    it("should return a genre if valid id is passed", async () => {
      const genre = await new Genre({ name: "genre123" });
      await genre.save();
      const response = await request(serverInstance).get(
        `/api/genres/${genre._id}`
      );
      expect(response.body[0]).toHaveProperty("name", genre.name);
    });

    it("should return 404 if an invalid id is passed", async () => {
      const response = await request(serverInstance).get(`/api/genres/1`);
      expect(response.status).toBe(404);
    });
  });

  describe("POST /", () => {
    it("should return 401 if client is not logged in", async () => {
      const response = await request(serverInstance).post("/api/genres").send({
        name: "genre1",
      });
      expect(response.status).toBe(401);
    });

    it("shoud return 400 if client sends wrong inputs", async () => {
      const token = new User().generateAuthToken();
      const response = await request(serverInstance)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "" });
      expect(response.status).toBe(400);
    });

    it("shoud save the genre if it's valid", async () => {
      const token = new User().generateAuthToken();
      await request(serverInstance)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "mockedGenre" });
      const genre = await Genre.find({ name: "mockedGenre" });
      expect(genre).not.toBeNull();
      expect(genre[0]).toHaveProperty("name", "mockedGenre");
    });
  });
});
