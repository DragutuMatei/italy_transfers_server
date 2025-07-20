import express from "express";
import { deleteById, create, getAll, updateByUid } from "../utils/CRUD.js";

const contact_router = express.Router();

contact_router.post("/insert", async (req, res) => {
  const { data } = req.body;
  const rasp = await create("contact", data);
  res.json({ ...rasp });
});

contact_router.get("/getAll", async (req, res) => {
  const rasp = await getAll("contact");
  res.json({ ...rasp });
});

contact_router.post("/delete", async (req, res) => {
  const { uid } = req.body;
  const rasp = await deleteById("contact", uid);
  res.json({ ...rasp });
}); 
export default contact_router;
