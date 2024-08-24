export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard",
    "/drivers",
    "/parties",
    "/remainders",
    "/reports",
    "/trips",
    "/trucks",
    "/vendors",
  ],
};
