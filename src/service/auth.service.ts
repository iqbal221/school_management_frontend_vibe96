import { tokenKey } from "@/constants/token-key";
import { instance as axiosInstance } from "@/helpers/axios/axiosInstance";
import { getBaseUrl } from "@/helpers/config/envConfig";
import { decodedToken } from "@/utils/jwt";
import {
  getFromLocalStorage,
  storeToLocalStorage,
} from "@/utils/local-storage";

export interface IUserInfo {
  userId?: string;
  id?: string;
  _id?: string;
  name: String;
  userRole?: string;
  iat?: number;
  exp?: number;
}

export const storeUserInfo = ({ accessToken }: { accessToken: string }) => {
  return storeToLocalStorage(tokenKey, accessToken);
};

export const getUserInfo = (): IUserInfo | null => {
  const authToken = getFromLocalStorage(tokenKey);

  if (!authToken) {
    return null;
  }

  const decodedData = decodedToken(authToken);

  return decodedData as IUserInfo;
};

export const isLoggedIn = () => {
  const authToken = getFromLocalStorage(tokenKey);
  return !!authToken;
};

export const removeUserInfo = (key: string) => {
  return localStorage.removeItem(key);
};

export const getNewAccessToken = async () => {
  return await axiosInstance({
    url: `${getBaseUrl()}/auth/refresh-token`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
};
