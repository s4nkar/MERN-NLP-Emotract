import { blockUserRoute, deleteUserRoute, unBlockUserRoute, usersRoute, singleUserRoute, userAnalyticsRoute } from '@/constants/api';
import axiosInstance from '@/utils/axiosInstance';
import axios from 'axios';
// ---------------------------- Student API ------------------------------------------------- //
// export async function resendEmail(email: string) {
//     try {
//       const res = await axios.post("/auth/register/resend-email/", { email });
//       return res.data;
//     } catch (error) {
//       console.log(error);
//       return error;
//     }
// }

export async function getUsers(
  limit?: number
) {
  try {
    const url = limit ? `${usersRoute}?limit=${limit}` : usersRoute;
    const res = await axiosInstance.get(url);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function getSingleUser(
  id: string
) {
  try {
    const url = `${singleUserRoute}/${id}`;
    const res = await axiosInstance.get(url);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function getUserAnalytics(
  id: string
) {
  try {
    const url = `${userAnalyticsRoute}/${id}`;
    const res = await axiosInstance.get(url);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function handleBlockUser(id: string) {
  try {
    const res = await axiosInstance.patch(`${blockUserRoute}/${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function handleUnBlockUser(id: string) {
  try {
    const res = await axiosInstance.patch(`${unBlockUserRoute}/${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function handleDeleteUser(id: string) {
  try {
    const res = await axiosInstance.delete(`${deleteUserRoute}/${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function getStudents(
  offset: number,
  pageLimit: number,
  country: string
) {
  try {
    const res = await axios.get(
      `https://api.slingacademy.com/v1/sample-data/users?offset=${offset}&limit=${pageLimit}` +
        (country ? `&search=${country}` : '')
    );
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}
