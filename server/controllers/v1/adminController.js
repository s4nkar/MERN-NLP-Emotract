import Users from "../../models/Users.js";

// get all users  
export const getCompleteUsersDetails = async (req, res, next) => {
  try {
    const users = await Users.find({ is_active: true, role: "USER" })
    .select(
      "email username avatarImage _id age firstname lastname phone imageUrl age_verified is_flagged flag_count last_active parent_email"
    );

    if (!users) return res.status(500).json({ message: "User not found" });

    const limit = parseInt(req.query.limit) || users.length;

    return res.json(users.slice(0, limit)).status(200);
  } catch (ex) {
    next(ex);
  }
};

// get single user details  
export const getUserDetails = async (req, res, next) => {
  try {
    const user = await Users.find({ is_active: true, role: "USER", _id: req.params.id })
    .select(
      "email username avatarImage _id age firstname lastname phone imageUrl age_verified is_flagged flag_count last_active parent_email is_online"
    );

    if (!user) return res.status(500).json({ message: "User not found" });

    return res.json(user[0]).status(200);
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

// get user analytics
export const getUserAnalytics = (req, res) => {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    return res.status(200).json("User alalytics created")
}