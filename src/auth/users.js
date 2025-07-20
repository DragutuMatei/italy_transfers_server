import express from "express";
import { createOrUpdateUser, getUser, updateUser } from "./user_crud.js";
import e from "express";
import { getAll, updateByUid } from "../utils/CRUD.js";

const router = express.Router();

// Endpoint to receive and save user data from frontend
router.post("/saveUser", async (req, res) => {
  const { uid, userData } = req.body;

  console.log("Saving user data for UID:", uid, "Data:", userData);
  if (!uid || !userData) {
    return res.status(404).json({ error: "Missing uid or userData" });
  }

  try {
    const newuser = await getUser(uid);
    let result;
    if (!newuser.success) {
      result = await createOrUpdateUser(uid, { ...userData, books: [] });
    } else {
      result = await createOrUpdateUser(uid, userData);
    }

    res.status(200).json({ ...result, newuser: user.user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to get user data
router.get("/getUserInfo/:uid", async (req, res) => {
  const { uid } = req.params;
  console.log("Fetching user info for UID:", uid);
  try {
    const result = await getUser(uid);
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.get("/getAllUsers", async (req, res) => {
  try {
    const all = await getAll("users");
    res.status(200).json(all);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/update", async (req, res) => {
  const { uid, data } = req.body;
  const rasp = await updateUser(uid, { ...data });
  res.json({ ...rasp });
});

router.post("/updatebooks", async (req, res) => {
  const { uid, data } = req.body;
  const user = await getUser(uid);
  user.user.books.push(data);
  console.log(user.user.books);
  const rasp = await updateUser(uid, { ...user.user });
  res.json({ ...rasp });
});

export default router;
