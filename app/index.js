const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const trimRequest = require("trim-request");
const logger = require("morgan");
const debug = require("debug")("app:express");
const db = require("../models");
const { ServerError } = require("../utils/core");

const { citizenRouter } = require("./router/citizen");
const { itemRouter } = require("./router/item");
const { companyRouter } = require("./router/company");
const { shopRouter } = require("./router/shop");
const { lookupRouter } = require("./router/lookup");
const { historyRouter } = require("./router/history");
const { queryRouter } = require("./router/query");

const app = express();
app.use(
  helmet({
    crossdomain: false,
    referrerPolicy: true,
    hidePoweredBy: { setTo: "PHP 4.2.0" },
  })
);
app.use(cors());
app.use(bodyParser.json({ limit: "50mb", strict: false }));
app.use(trimRequest.all);
app.use(logger("dev"));
// alert database
db.sequelize.sync({ alter: true });
// eslint-disable-next-line no-unused-vars
app.get("/", (req, res, next) => {
  res.json({ message: "server is Up and Running!" });
});

app.use("/citizen", citizenRouter);
app.use("/item", itemRouter);
app.use("/company", companyRouter);
app.use("/shop", shopRouter);
app.use("/lookups", lookupRouter);
app.use("/history", historyRouter);
app.use("/query", queryRouter);

// 404 handler
app.use("*", (req, res, next) => {
  next(new ServerError("API_NOT_FOUND", 404));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (!err.status) {
    debug(err);
    // process.exit(0);
    return res
      .status(500)
      .json({ code: "GENERAL_ERROR", message: "server_error" });
  }
  debug("Custom Server Error >", err.message);
  return res
    .status(err.status)
    .json({ message: err.message, status: err.status });
});

module.exports = { app };
