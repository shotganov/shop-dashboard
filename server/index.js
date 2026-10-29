require("dotenv/config");
const express = require("express");
const cors = require("cors");
const customersRouter = require("./routes/customers");
const ordersRouter = require("./routes/orders");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/customers", customersRouter);
app.use("/api/orders", ordersRouter);

app.use(notFound);
app.use(errorHandler);

const port = Number(process.env.PORT) || 5000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
