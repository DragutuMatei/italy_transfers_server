import express from "express";
import router from "./src/auth/users.js";
import contact_router from "./src/contact/contact.js";
import fileUpload from "express-fileupload";
import bodyParser from "body-parser";
import {
  captureOrder,
  createOrder,
  generateClientToken,
} from "./src/payments/paypal.js";
import testimonials_router from "./src/testimonials/testimonials.js";
import books_router from "./src/books/book.js";
import platform_router from "./src/platform/platform.js";
import "dotenv/config";

const app = express();

// const bodyParser = require("body-parser");

app.use(fileUpload());
app.use(bodyParser.json({ limit: "1500mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "1500mb",
    extended: true,
    parameterLimit: 500000,
  })
);
app.use(bodyParser.text({ limit: "1500mb" }));

// app.use(express.json({ limit: "1500mb" }));
// app.use(express.urlencoded({ limit: "1500mb" }));

app.use(express.json());

app.use(function (req, res, next) {
  const origins = [
    "http://localhost:3002",
    "http://localhost:3000",
    "http://localhost:3003",
    "https://dvchauffeurs.netlify.app",
    "https://admindvchauffeurs.netlify.app",
    "https://trevi-chauffeurs.com"
  ];

  const origin =
    origins.includes(req.header("origin").toLowerCase()) && req.headers.origin;
  console.log(origin);
  res.setHeader("Access-Control-Allow-Origin", origin);

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

app.use("/api", router);
app.use("/contact", contact_router);
app.use("/testimonials", testimonials_router);
app.use("/books", books_router);
app.use("/platform", platform_router);

app.post("/create-order", async (req, res) => {
  const total = req.body.total || "10.00";
  const order = await createOrder(total);
  res.json(order);
});

app.post("/capture-order", async (req, res) => {
  // const { orderId } = req.body;
  // console.log("orderId: ", orderId);
  // const captured = await captureOrder(orderId);
  // res.json(captured);

  const { orderId } = req.body;
  const captured = await captureOrder(orderId);

  // const payerEmail = captured?.payer?.email_address;
  // const fullName = `${captured?.payer?.name?.given_name} ${captured?.payer?.name?.surname}`;
  // const amount =
  //   captured?.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value;
  // console.log(payerEmail, fullName, amount);
  // try {
  //   const invoiceId = await createAndSendInvoice(payerEmail, fullName, amount);
  //   console.log("Invoice sent, ID:", invoiceId);
  // } catch (err) {
  //   console.error(
  //     "Eroare la trimiterea facturii:",
  //     err.response?.data || err.message
  //   );
  // }

  res.json(captured);
});

app.get("/generate-client-token", async (req, res) => {
  const token = await generateClientToken();
  // console.log("token", token);
  res.json({ clientToken: token });
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`App listening at port ${PORT}`));
