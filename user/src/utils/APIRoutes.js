export const host = import.meta.env.VITE_BACKEND_URL;
console.log("host",host)
export const loginRoute = `${host}/api/auth/login`;
export const registerRoute = `${host}/api/auth/register`;
export const resetPasswordRoute = `${host}/api/auth/reset-password`;
export const forgotPasswordRoute = `${host}/api/auth/forgot-password`;
export const logoutRoute = `${host}/api/auth/logout`;
export const allUsersRoute = `${host}/api/auth/allusers`;
export const sendMessageRoute = `${host}/api/messages/addmsg`;
export const recieveMessageRoute = `${host}/api/messages/getmsg`;
export const setAvatarRoute = `${host}/api/auth/setavatar`;