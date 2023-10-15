import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

const generateAuthToken = (user) => {
  dotenv.config();

  const jwtSecretKey = "supersecretkey474485";

  const token = jwt.sign(
    { _id: user._id, name: user.name, email: user.email, type: user.type },
    jwtSecretKey
  );

  return token;
};

export default generateAuthToken;
