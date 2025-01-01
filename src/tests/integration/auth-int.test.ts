import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  beforeAll,
} from "@jest/globals";
import request from "supertest";
import { server } from "../../index";
import { User } from "../../db/models/user";

import { Genre } from "../../db/models/genre";
import { Server } from "http";

describe("auth middleware", () => {
  let serverInstance: Server = server;
  beforeAll(() => serverInstance.closeAllConnections());
  beforeEach(() => {
    serverInstance.closeAllConnections();
    serverInstance = server;
  });
  afterEach(async () => {
    serverInstance.close();
    await Genre.collection.deleteMany({});
  });
  let token: any;
  let name = "mockedGenre";
  const exec = () =>
    request(serverInstance)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name });

  beforeEach(() => {
    token = new User().generateAuthToken();
  });

  it("should return 401 if no token is provided", async () => {
    token = "";
    const response = await exec();
    expect(response.status).toBe(401);
  });
  it("should return 400 if token is invalid", async () => {
    token = null;
    const response = await exec();
    expect(response.status).toBe(400);
  });
  it("should return 200 if the token is valid", async () => {
    const response = await exec();
    expect(response.status).toBe(200);
  });
});
