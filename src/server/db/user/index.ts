import db from "../connection";
import bcrypt from "bcrypt";

const register = async (email: string, password: string) => {
  const hashPass = await bcrypt.hash(password, 10);
  const { id } = await db.one(
    "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id",
    [email, hashPass],
  );

  return id;
};
const login = async (email: string, password: string) => {
  const user = await db.one("SELECT * from users WHERE email = $1", [email]);

  const validPassword = await bcrypt.compare(password, user.password);

  if (validPassword) {
    return user;
  } else {
    return null;
  }
};

export default { register, login };
