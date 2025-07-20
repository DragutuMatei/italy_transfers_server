import express from "express";
import {
  create,
  deleteById,
  getAll,
  getAllByField,
  updateByUid,
} from "../utils/CRUD.js";

const testimonials_router = express.Router();

testimonials_router.post("/insert", async (req, res) => {
  const { data } = req.body;
  const rasp = await create("testimonials", data);
  res.json({ ...rasp });
});

testimonials_router.post("/update", async (req, res) => {
  const { data, uid } = req.body;
  const rasp = await updateByUid("testimonials", uid, { ...data });
  res.json({ ...rasp });
});

testimonials_router.get("/getAll", async (req, res) => {
  const rasp = await getAll("testimonials");
  res.json({ ...rasp });
});
testimonials_router.get("/getAllByField/:name/:value", async (req, res) => {
  const { name, value } = req.params;
  const rasp = await getAllByField("testimonials", name, value);
  res.json({ ...rasp });
});
testimonials_router.post("/delete", async (req, res) => {
  const { uid } = req.body;
  const rasp = await deleteById("testimonials", uid);
  res.json({ ...rasp });
});

export default testimonials_router;
