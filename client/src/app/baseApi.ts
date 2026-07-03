import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include",
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  object,
  FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && (result.error as FetchBaseQueryError).status === 401) {
    const url = typeof args === "string" ? args : args.url;
    // Attempt silent token refresh if not already calling an auth endpoint
    if (!url.includes("/auth/refresh") && !url.includes("/auth/verify-otp") && !url.includes("/auth/request-otp")) {
      const refreshResult = await baseQuery(
        { url: "/auth/refresh", method: "POST", body: {} },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        // Retry original request with the new access token cookie
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch({ type: "auth/logout" });
      }
    } else {
      api.dispatch({ type: "auth/logout" });
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth", "Profile"],
  endpoints: () => ({}),
});
