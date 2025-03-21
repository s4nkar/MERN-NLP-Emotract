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

    await Users.findByIdAndUpdate(
      userId,
      {
        is_flagged: true
      }
    )

    return res.status(200).json({ status: true, messsage: "User blocked" });
  } catch (ex) {
    res.status(500).json({ status: false, message: ex });
    next(ex);
  }
};