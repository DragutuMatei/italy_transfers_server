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
    return res.status(400).json({ error: "Missing uid or userData" });
  }

  try {
    const existingUser = await getUser(uid);
    let result;

    if (!existingUser.success) {
      // New user - create with books array
      result = await createOrUpdateUser(uid, { ...userData, books: [] });
      console.log("Created new user:", uid);
    } else {
      // Existing user - update
      result = await createOrUpdateUser(uid, userData);
      console.log("Updated existing user:", uid);
    }

    // Get the saved user data to return
    const savedUser = await getUser(uid);

    res.status(200).json({
      ...result,
      user: savedUser.success ? savedUser.user : userData,
      success: true,
    });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({
      error: "Failed to save user",
      message: error.message,
      success: false,
    });
  }
});

// Endpoint to get user data
router.get("/getUserInfo/:uid", async (req, res) => {
  const { uid } = req.params;
  console.log("Fetching user info for UID:", uid);
  try {
    const result = await getUser(uid);
    console.log("User fetch result:", result);

    if (!result.success) {
      console.log("User not found in database:", uid);
      return res.status(404).json({
        error: "User not found",
        message: result.message,
        success: false,
      });
    }

    console.log("User found successfully:", uid);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getUserInfo:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
      success: false,
    });
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
