import axios from "axios";
import express from "express";
import { getUser, updateUser } from "../auth/user_crud.js";
import { getAllByIds, updateByUid } from "../utils/CRUD.js";

const platform_router = express.Router();

platform_router.post("/insert", async (req, res) => {
  const { sendData } = req.body;
  sendData["token"] = process.env.NCCGEST_APY_KEY;
  try {
    const api_to_nccgest = await axios.post(
      `https://api.nccgest.com/api/rest_api.php?dominio=nrcvlad&token=${process.env.NCCGEST_APY_KEY}&cmd=cmd_insert`,
      sendData,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "Platform data inserted successfully",
      data: api_to_nccgest.data,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
platform_router.post("/update", async (req, res) => {
  const { decisition, data, book_uid } = req.body;
  if (decisition) {
    data["token"] = process.env.NCCGEST_APY_KEY;

    const api_to_nccgest = await axios.post(
      `https://api.nccgest.com/api/rest_api.php?dominio=nrcvlad&token=${process.env.NCCGEST_APY_KEY}&cmd=cmd_insert`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    const book = (await getAllByIds("books", [book_uid])).data;
    let new_book = {
      ...book[0],
      accept_book: true,
      serviceid: api_to_nccgest.data.serviceid,
    };
    const update_book = await updateByUid("books", book_uid, new_book);

    if (!update_book.success) {
      res.send({ success: false });
    }
    res.send({ success: true });
  } else {
    res.send({ success: true });
  }
});

export default platform_router;
