import { Schema, model, startSession, connect, Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface UserProps {
  name: string;
  email: string;
  password: string;
}

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: Boolean,
  },
  {
    methods: {
      generateAuthToken() {
        const token = jwt.sign(
          { _id: this._id, isAdmin: this.isAdmin },
          process.env.VIDLY_JWT_PRIVATE_KEY!
        );
        return token;
      },
      lookup() {},
    },
  }
);

export const User = model("User", userSchema);

export const createUser = async (
  user: UserProps
): Promise<{ user: Omit<UserProps, "password">; token: string }> => {
  const session = await startSession();
  session.startTransaction();
  try {
    let createdUser = new User(user);
    const token = createdUser.generateAuthToken();
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(user.password, salt);
    createdUser.password = hashed;
    await createdUser.save({ session });
    await session.commitTransaction();
    console.log(createdUser);
    return {
      user: { email: createdUser.email, name: createdUser.name },
      token,
    };
  } catch (err) {
    throw err;
  } finally {
    await session.endSession();
  }
};

export const getUsers = async () => {
  const users = await User.find().sort("name");
  return users;
};

export const getUser = async (id: any) => {
  const user = await User.findById(id).select("-password");
  if (!user) throw new Error("User not found");
  return user;
};
