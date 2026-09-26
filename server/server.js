const express = require("express");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");

const dotenv = require("dotenv");
dotenv.config();

const { router } = require("./routes");
const { connectDB } = require("./config/db");

const { ResponseHandler } = require("./helpers/responseHandler");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  ResponseHandler(res, 200, true, "Server is running!");
});

app.use("/api", router);

app.use((req, res) => {
  ResponseHandler(
    res,
    404,
    false,
    "Route not found! Please check your endpoint.",
  );
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port: ${PORT}`);
  connectDB();
});
