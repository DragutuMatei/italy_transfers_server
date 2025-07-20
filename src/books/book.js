import express from "express";
import {
  create,
  deleteById,
  getAll,
  getAllByField,
  updateByUid,
  getAllByIds,
} from "../utils/CRUD.js";

const books_router = express.Router();

books_router.post("/insert", async (req, res) => {
  const { data } = req.body;
  const rasp = await create("books", data);
  res.json({ ...rasp });
});

books_router.post("/update", async (req, res) => {
  const { data, uid } = req.body;
  const rasp = await updateByUid("books", uid, data);
  res.json({ ...rasp });
});

books_router.get("/getAll", async (req, res) => {
  const rasp = await getAll("books");
  res.json({ ...rasp });
});
books_router.get("/getAllByField/:name/:value", async (req, res) => {
  const { name, value } = req.params;
  const rasp = await getAllByField("books", name, value);
  res.json({ ...rasp });
});
books_router.post("/delete", async (req, res) => {
  const { uid } = req.body;
  const rasp = await deleteById("books", uid);
  res.json({ ...rasp });
});
books_router.post("/getManyByIds", async (req, res) => {
  const { ids } = req.body;
  const rasp = await getAllByIds("books", ids);
  res.json({ ...rasp });
});

export default books_router;
