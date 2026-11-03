// baseQuery.ts
import { cookieHelper, TOKEN_KEY} from "@/lib/cookies";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getCookie, } from "cookies-next";

const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_API_URL}`,
  prepareHeaders: (headers, { arg }) => {
    const token = getCookie(TOKEN_KEY);
    const language = getCookie("") ||"ar";

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    headers.set("accept", "application/json");
    headers.set("accept-language", language as string);
    headers.set("x-api-key", process.env.NEXT_PUBLIC_API_KEY as string);

    return headers;
  },
});

export default baseQuery;