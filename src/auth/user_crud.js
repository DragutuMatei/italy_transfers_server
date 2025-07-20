import { db } from '../../admin_fire.js';

// Create or Update user data in Firestore
export const createOrUpdateUser = async (uid, userData) => {
  try {
    const userRef = db.collection('users').doc(uid);
    await userRef.set(userData, { merge: true }); // merge: true to update existing data without overwriting
    return { success: true, message: 'User data saved successfully' };
  } catch (error) {
    console.error('Error creating/updating user:', error);
    throw new Error('Failed to create/update user');
  }
};

export const getUser = async (uid) => {
  try {
    const userRef = db.collection('users').doc(uid);
    const doc = await userRef.get();
    if (!doc.exists) {
      throw new Error('User not found');
    }
    return { success: true, user: doc.data() };
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('Failed to fetch user');
  }
};

// Update specific user fields
export const updateUser = async (uid, userData) => {
  try {
    const userRef = db.collection('users').doc(uid);
    await userRef.update(userData);
    return { success: true, message: 'User data updated successfully' };
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user');
  }
};

// Delete user data from Firestore
export const deleteUser = async (uid) => {
  try {
    const userRef = db.collection('users').doc(uid);
    await userRef.delete();
    return { success: true, message: 'User data deleted successfully' };
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Failed to delete user');
  }
};