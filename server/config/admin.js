import Users from "../models/Users.js";
import bcrypt from "bcrypt";

export const createDefaultAdmin = async () => {
    try {
      const adminExists = await Users.findOne({ role: "ADMIN" });
      if (!adminExists) {
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
        const admin = new Users({
          username: process.env.ADMIN_USERNAME,
          email: process.env.ADMIN_EMAIL,
          password: hashedPassword,
          firstname: "Super",
          lastname: "Admin",
          age: 30,
          phone: process.env.ADMIN_PHONE || "9999999999",
          role: "ADMIN",
          is_active: true,
        });

        await admin.save();
        console.log("Default admin user created.");
      } else {
        // console.log("Admin user already exists.");
      }
    } catch (error) {
      console.error("Error creating admin user:", error);
    }
};