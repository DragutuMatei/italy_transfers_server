import { db } from "../../admin_fire.js";
import { where } from "firebase/firestore";

const create = async (collection, data) => {
  try {
    const ref = await db.collection(collection).add(data);
    return {
      success: true,
      message: "Document created successfully",
      uid: ref.id,
      data: ref.get(ref.id),
    };
  } catch (error) {
    console.error("Error creating document:", error);
    console.log(error);
    return { success: false, message: "no" };
  }
};
const createOrUpdate = async (collection, uid, data) => {
  try {
    const ref = db.collection(collection).doc(uid);
    await ref.set(data, { merge: true });
    return { success: true, message: "Data saved successfully" };
  } catch (error) {
    console.error("Error creating/updating:", error);
    console.log(error);
    return { success: false, message: "no" };
  }
};

const getbyUid = async (collection, uid) => {
  try {
    const ref = db.collection(collection).doc(uid);
    const doc = await ref.get();
    if (!doc.exists) {
      throw new Error("Document not found");
    }
    return { success: true, user: doc.data() };
  } catch (error) {
    console.error("Error fetching document:", error);
    console.log(error);
    return { success: false, message: "no" };
  }
};

const updateByUid = async (collection, uid, data) => {
  try {
    const ref = db.collection(collection).doc(uid);
    await ref.update(data);
    return { success: true, message: "Data updated successfully" };
  } catch (error) {
    console.error("Error updating:", error);
    console.log(error);
    return { success: false, message: "no" };
  }
};

const deleteById = async (collection, uid) => {
  try {
    const ref = db.collection(collection).doc(uid);
    await ref.delete();
    return { success: true, message: "Data deleted successfully" };
  } catch (error) {
    console.error("Error deleting:", error);
    console.log(error);
    return { success: false, message: "no" };
  }
};
const getAll = async (collection) => {
  try {
    const snapshot = await db.collection(collection).get();

    if (snapshot.empty) {
      return { success: true, data: [], message: "No documents found" };
    }
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching documents:", error);
    console.log(error);
    return { success: false, message: "no" };
  }
};
const getAllByField = async (collection, fieldName, fieldValue) => {
  try {
    const snapshot = await db
      .collection(collection)
      .where(fieldName, "==", fieldValue === "true")
      .get();

    if (snapshot.empty) {
      return { success: false, data: [], message: "No documents found" };
    }

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("data: ", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching documents:", error);
    console.log(error);
    return { success: false, message: "Error fetching documents" };
  }
};

const getAllByIds = async (collection, ids) => {
  try {
    if (!Array.isArray(ids) || ids.length === 0) {
      return { success: true, data: [] };
    }
    const snapshot = await db
      .collection(collection)
      .where("__name__", "in", ids)
      .get();
    if (snapshot.empty) {
      return { success: true, data: [], message: "No documents found" };
    }
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching documents by ids:", error);
    return { success: false, message: "Error fetching documents by ids" };
  }
};

export {
  create,
  createOrUpdate,
  getbyUid,
  updateByUid,
  deleteById,
  getAll,
  getAllByField,
  getAllByIds,
};
