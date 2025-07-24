import axios from "axios";
import qs from "qs";
const base = "https://api-m.sandbox.paypal.com";

async function generateAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  try {
    const response = await axios({
      url: `${base}/v1/oauth2/token`,
      method: "post",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: qs.stringify({
        grant_type: "client_credentials",
      }),
    });

    // console.log("Access Token:", response.data.access_token);
    return response.data.access_token;
  } catch (error) {
    console.error("Eroare 401:", error.response?.data || error.message);
    console.log(error);
    throw error;
  }
}
async function generateClientToken() {
  const accessToken = await generateAccessToken();

  const response = await axios({
    url: "https://api-m.sandbox.paypal.com/v1/identity/generate-token",
    method: "post",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data.client_token; // Ex. usage may vary based on Hosted Fields product
}
async function createOrder(total) {
  const accessToken = await generateAccessToken();
  const response = await axios({
    url: `${base}/v2/checkout/orders`,
    method: "post",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    data: {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "EUR",
            value: total,
          },
        },
      ],
    },
  });

  return response.data;
}

async function captureOrder(orderId) {
  const accessToken = await generateAccessToken();
  const response = await axios.post(
    `${base}/v2/checkout/orders/${orderId}/capture`,
    {}, // body gol
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // NU pune 'Content-Type': 'application/json'
      },
    }
  );

  return response.data;
}
async function createAndSendInvoice(payerEmail, fullName, amount) {
  const accessToken = await generateAccessToken();

  const invoiceData = {
    detail: {
      currency_code: "USD",
      note: "Thank you for your purchase!",
      terms_and_conditions: "No refunds after 14 days",
    },
    invoicer: {
      name: {
        given_name: "Your Company",
      },
    },
    primary_recipients: [
      {
        billing_info: {
          name: {
            full_name: fullName,
          },
          email_address: payerEmail,
        },
      },
    ],
    items: [
      {
        name: "Product or Service",
        quantity: "1",
        unit_amount: {
          currency_code: "USD",
          value: amount,
        },
      },
    ],
  };

  // 1. Creare factură
  const createResp = await axios.post(
    "https://api-m.sandbox.paypal.com/v2/invoicing/invoices",
    invoiceData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  const invoiceId = createResp.data.id;

  // 2. Trimitere factură
  await axios.post(
    `https://api-m.sandbox.paypal.com/v2/invoicing/invoices/${invoiceId}/send`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return invoiceId;
}
export { createOrder, captureOrder, generateClientToken, createAndSendInvoice };
