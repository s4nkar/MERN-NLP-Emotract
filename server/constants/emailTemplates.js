import dotenv from "dotenv";
dotenv.config();

// Email Templates
export const PARENT_NOTIFY_TEMPLATE = {
  NOTIFY_PARENT_BLOCK: {
    subject: "Your Child Has Been Blocked",
    body: `
      Dear {parentName}, <br>
      We regret to inform you that your child, {childName}, has been blocked from our platform Emotract v1 due to a violation of our policies, mainly due to inappropriate conversations.
      Please contact us at ${process.env.ADMIN_EMAIL} for more details. <br>
      Regards, <br>
      Emotract v1 Team
    `,
  },
};

export const USER_WARN_TEMPLATE = {
  USER_WARN_BLOCK: {
    subject: "Emotract v1 | Inappropriate Conversation Warning!",
    body: `
      Dear {childName}, <br>
      You have received a warning due to inappropriate conversations on Emotract v1. Continued violations may result in a block.
      Please contact us at ${process.env.ADMIN_EMAIL} for more details. <br>
      Regards, <br>
      Emotract v1 Team
    `,
  },
};