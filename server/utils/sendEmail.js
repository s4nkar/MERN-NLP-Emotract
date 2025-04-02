import { PARENT_NOTIFY_TEMPLATE, USER_WARN_TEMPLATE } from "../constants/emailTemplates.js";
import { transporter } from "../config/email.js";

export const sendResetEmail = async (email, token) => {
    try {
      await transporter.sendMail({
        from: `"Emotract V1" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Password Reset Request",
        html: `<p>Click <a href="${process.env.FRONTEND_URL}/reset-password/${token}">here</a> to reset your password.</p>`,
      });
  
      console.log("Password reset email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Email not sent");
    }
  };
  
// Send Parent Email Function
export const sendParentEmail = async (email, templateKey, data = {}) => {
    try {
      const template = PARENT_NOTIFY_TEMPLATE[templateKey];
      if (!template) {
        throw new Error(`Template ${templateKey} not found`);
      }
  
      const formattedBody = template.body
        .replace("{childName}", data.childName || "your child")
        .replace("{parentName}", data.parentName || "Guardian");
  
      const mailOptions = {
        from: `"Emotract V1" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: template.subject,
        html: formattedBody,
      };
  
      await transporter.sendMail(mailOptions);
      console.log(`Parent email sent successfully to ${email}`);
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Email not sent");
    }
};

// Send Email to Warn user
export const warnUsersendEmail = async (email, templateKey, data = {}) => {
    try {
      const template = USER_WARN_TEMPLATE[templateKey];
      if (!template) {
        throw new Error(`Template ${templateKey} not found`);
      }
  
      const formattedBody = template.body
        .replace("{childName}", data.childName || "User")
    
      const mailOptions = {
        from: `"Emotract V1" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: template.subject,
        html: formattedBody,
      };

      await transporter.sendMail(mailOptions);
      console.log(`User warn email sent successfully to ${email}`);
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Email not sent");
    }
};