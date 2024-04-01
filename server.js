import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import corsOptions from "./config/corsOptions.js";
import { connectDB } from "./config/dbConn.js";
import errorHandler from "./middleware/errorHandler.js";
import { logEvents, logger } from "./middleware/logger.js";
import { rootDir } from "./util/rootDir.js";
dotenv.config();

const PORT = process.env.PORT || 3500;
const app = express();

// Connect to mongodb
mongoose.set("strictQuery", false);
connectDB();

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(logger);
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

//static is a middleware which can give access to use static files in express.
app.use("/", express.static(path.join(rootDir(), "public")));

// not found route
app.use("*", (req, res, next) => {
  res.status(404).json({ message: "Not found!" });
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  app.listen(PORT, () => {
    console.log(`listening to port ${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  logEvents(
    `${err.no}: ${err.code}\t${err.sysCall}\t${err.hostName}`,
    "mongoErrLog.log"
  );
});
