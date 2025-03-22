import Users from "../../models/Users.js";

// get all users  
export const getCompleteUsersDetails = async (req, res, next) => {
  try {
    const users = await Users.find({ is_active: true })
    .select(
      "email username avatarImage _id age firstname lastname phone imageUrl age_verified is_flagged flag_count last_active"
    );
 
    const limit = parseInt(req.query.limit) || users.length;

    return res.json(users.slice(0, limit));
  } catch (ex) {
    next(ex);
  }
};

// Block user 
export const blockUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const updatedUser = await Users.findByIdAndUpdate(
      userId,
      {
        is_flagged: true
      }
    )

    if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

    return res.status(200).json({ status: true, messsage: "User successfully blocked" });
  } catch (ex) {
    res.status(500).json({ status: false, message: ex });
    next(ex);
  }
};

// Unblock user 
export const unBlockUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const updatedUser = await Users.findByIdAndUpdate(
      userId,
      {
        is_flagged: false
      }
    )

    if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

    return res.status(200).json({ status: true, messsage: "User successfully unblocked" });
  } catch (ex) {
    res.status(500).json({ status: false, message: ex });
    next(ex);
  }
};

// Delete a  user (soft delete) 
export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const updatedUser = await Users.findByIdAndUpdate(
      userId,
      {
        is_active: false
      }
    )

    if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

    return res.status(200).json({ status: true, messsage: "User deleted" });
  } catch (ex) {
    res.status(500).json({ status: false, message: ex });
    next(ex);
  }
};