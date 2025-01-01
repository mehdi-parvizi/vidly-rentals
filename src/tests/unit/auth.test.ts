import { describe, it, expect, jest } from "@jest/globals";
import { User } from "../../db/models/user";
import { Types } from "mongoose";
import { auth, CustomRequest } from "../../middleware/auth";
import { Response } from "express";
describe("auth middleware", () => {
  it("should populate req.user with correct payload", () => {
    const user = { _id: new Types.ObjectId().toHexString(), isAdmin: true };
    const token = new User(user).generateAuthToken();
    const req = {
      header: jest.fn().mockReturnValue(token),
    } as unknown as CustomRequest;
    const res = {} as Response;
    const next = jest.fn();
    auth(req, res, next);
    expect(req.user).toMatchObject(user);
  });
});
