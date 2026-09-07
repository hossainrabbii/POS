import { User } from "./user.model.js";

// ======================================================
// GET ALL USERS
// ======================================================

export const getAllUsers = async () => {
  const users = await User.find()
    .select("_id name email role status")
    .sort({
      createdAt: -1,
    })
    .lean();

  return users;
};