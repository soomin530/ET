// axiosAPI.js

import axios from "axios";

export const axiosApi = axios.create({
  baseURL: "https://adminmodeunticket.store",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  withCredentials: true, // 쿠키 포함 설정
  // 서버에서도 credential 허용 설정 필요함
});
