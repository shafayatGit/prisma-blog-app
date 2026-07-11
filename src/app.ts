import express, { Application, Request, Response } from "express";
import postRouter from "./modules/post/post.router";
import commentRouter from "./modules/comment/comment.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import errorHandler from "./middleware/globalErrorHandler";
import SSLCommerzPayment from "sslcommerz-lts";

const app: Application = express();

app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());
app.use("/posts", postRouter);
app.use("/comments", commentRouter);
app.use(express.urlencoded({ extended: true }));

const store_id = process.env.SSLCZ_STORE_ID;
const store_passwd = process.env.SSLCZ_STORE_PASSWD;
if (!store_id || !store_passwd) {
  throw new Error(
    "SSLCommerz store ID and password must be set in environment variables.",
  );
}
const is_live = false; // sandbox

interface OrderData {
  total_amount: number;
  currency: string;
  tran_id: string;
  success_url: string;
  fail_url: string;
  cancel_url: string;
  ipn_url: string;
  shipping_method: string;
  ship_name: string;
  ship_add1: string;
  ship_add2?: string;
  ship_city: string;
  ship_state?: string;
  ship_postcode: string;
  ship_country: string;
  product_name: string;
  product_category: string;
  product_profile: string;
  cus_name: string;
  cus_email: string;
  cus_add1: string;
  cus_city: string;
  cus_postcode: string;
  cus_country: string;
  cus_phone: string;
}

app.post("/init-payment", async (req: Request, res: Response) => {
  const tran_id = `TXN_${Date.now()}`;

  const data: OrderData = {
    total_amount: 1000,
    currency: "BDT",
    tran_id,
    success_url: `${process.env.BASE_URL}/payment/success`,
    fail_url: `${process.env.BASE_URL}/payment/fail`,
    cancel_url: `${process.env.BASE_URL}/payment/cancel`,
    ipn_url: `${process.env.BASE_URL}/payment/ipn`,
    shipping_method: "Courier",
    product_name: "Sample Product",
    product_category: "General",
    product_profile: "general",
    ship_name: "Customer Name",
    ship_add1: "Dhaka",
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: "1000",
    ship_country: "Bangladesh",
    cus_name: "Customer Name",
    cus_email: "customer@example.com",
    cus_add1: "Dhaka",
    cus_city: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: "01700000000",
  };

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  const apiResponse = await sslcz.init(data);
  console.log("SSLCommerz API Response:", apiResponse);

  // Persist tran_id + order in your DB here as "PENDING" before redirecting

  res.json({ GatewayPageURL: apiResponse.GatewayPageURL });
  // Client-side: redirect window.location to apiResponse.GatewayPageURL,
  // or use the sessionkey with the embed.min.js widget for true Easy Checkout inline UI.
});

// IPN listener — SSLCommerz posts here after payment
app.post("/payment/ipn", async (req: Request, res: Response) => {
  const { val_id, tran_id } = req.body;

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  const validation = await sslcz.validate({ val_id });

  if (validation.status === "VALID" || validation.status === "VALIDATED") {
    // Verify tran_id and amount match your stored order before marking paid
  }

  res.status(200).send();
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(errorHandler);
export default app;
