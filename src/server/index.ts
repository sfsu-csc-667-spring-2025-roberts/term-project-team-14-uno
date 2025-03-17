import * as path from "path";
import express, { urlencoded } from "express";
import httpErrors from "http-errors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

// custom routes
import rootRoutes from "./roots/root";
// custom middleware

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(process.cwd(), "public")));
app.set("views", path.join(process.cwd(), "src", "server", "templates"));
app.set("view engine", "ejs");

app.use("/", rootRoutes);

app.use((_, __, next) => {
  next(httpErrors(404));
});

app.listen(PORT, () => {
  console.log("server listening at port: ", PORT);
});
