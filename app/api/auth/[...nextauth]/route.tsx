import NextAuth from "next-auth";
import { authOptions } from "./authOptions";

// Declare the session type to include the id, name, and email
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
    };
  }

  interface JWT {
    id: string;
    name: string;
    email: string;
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
