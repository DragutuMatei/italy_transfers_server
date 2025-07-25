import express from "express";
import {
  create,
  deleteById,
  getAll,
  getAllByField,
  updateByUid,
  getbyUid,
} from "./utils/CRUD.js";

const router = express.Router();

// Adaugă email la newsletter
router.post("/", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.json({ success: false, message: "No email" });
  try {
    // Verifică dacă emailul există deja
    const all = await getAll("newsletters");
    if (all.data.some((n) => n.email === email)) {
      return res.json({ success: false, message: "Email already subscribed" });
    }
    // Adaugă în newsletters
    const createRes = await create("newsletters", {
      email,
      created: Date.now(),
    });
    // Update user dacă există
    const users = await getAllByField("users", "email", email);
    if (users.success && users.data.length > 0) {
      await updateByUid("users", users.data[0].id, { hasnews: true });
    }
    return res.json({ success: true });
  } catch (e) {
    return res.json({ success: false, message: e.message });
  }
});

// Șterge email din newsletter
router.delete("/", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.json({ success: false, message: "No email" });
  try {
    // Găsește documentul cu emailul
    const all = await getAll("newsletters");
    const found = all.data.find((n) => n.email === email);
    if (!found) return res.json({ success: false, message: "Not found" });
    await deleteById("newsletters", found.id);
    // Update user dacă există
    const users = await getAllByField("users", "email", email);
    if (users.success && users.data.length > 0) {
      await updateByUid("users", users.data[0].id, { hasnews: false });
    }
    return res.json({ success: true });
  } catch (e) {
    return res.json({ success: false, message: e.message });
  }
});

// Listă newslettere (admin)
router.get("/", async (req, res) => {
  const all = await getAll("newsletters");
  return res.json(all);
});

export default router;
