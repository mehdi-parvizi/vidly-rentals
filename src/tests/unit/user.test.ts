import { describe, it, expect } from "@jest/globals";
import { User } from "../../db/models/user.ts";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import { Payload } from "../../middleware/auth.ts";
import dotenv from "dotenv";
dotenv.config();

describe("generateAuthToken", () => {
  it("should generate a jwt token", () => {
    const user = { _id: new Types.ObjectId().toHexString(), isAdmin: true };
    const newUser = new User(user);
    const token = newUser.generateAuthToken();
    const payload = jwt.verify(
      token,
      process.env.VIDLY_JWT_PRIVATE_KEY!
    ) as Payload;
    expect(user._id).toBe(payload._id);
  });
});
