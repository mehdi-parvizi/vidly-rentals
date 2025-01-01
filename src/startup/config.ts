export default () => {
  if (!process.env.VIDLY_JWT_PRIVATE_KEY) {
    throw new Error("FATAL ERROR: JwtPrivateKey is undefined");
  }
};
