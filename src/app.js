const express = require("express");

const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const createError = require("http-errors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({});
});

app.use((req, res, next) => {
  next(createError(404, "Not found"));
});

app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ success: false, status: err.status, name: err.name, ...err });
});

module.exports = app;
