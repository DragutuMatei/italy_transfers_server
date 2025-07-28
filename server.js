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
import newsletter_router from "./src/newsletters.js";
import "dotenv/config";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import xss from "xss-clean";

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

// Helmet pentru headers de securitate
app.use(helmet());

// xss-clean pentru protecție XSS
app.use(xss());

// CORS strict
const allowedOrigins = [
  "http://localhost:3002",
  "http://localhost:3000",
  "http://localhost:3003",
  "https://dvchauffeurs.netlify.app",
  "https://admindvchauffeurs.netlify.app",
  "https://trevi-chauffeurs.com",
  "https://admin.trevi-chauffeurs.com",
];
app.use(
  cors({
    origin: function (origin, callback) {
      // Permite requests fără origin (ex: curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Rate limiting global (100 requests/15min per IP)
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use("/api", router);
app.use("/contact", contact_router);
app.use("/testimonials", testimonials_router);
app.use("/books", books_router);
app.use("/platform", platform_router);
app.use("/api/newsletter", newsletter_router);

app.post("/create-order", async (req, res) => {
  const total = req.body.total || "10.00";
  const order = await createOrder(total);
  res.json(order);
});

app.post("/capture-order", async (req, res) => {

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
