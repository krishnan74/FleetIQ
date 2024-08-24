import { getServerSession } from "next-auth";
import { LoginButton, LogoutButton } from "./auth";

export default async function Home() {
  return (
    <main>
      <LoginButton />
      <LogoutButton />
      <h2>Server Session</h2>

      <h2>Client Call</h2>
    </main>
  );
}
