import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { RiBarChart2Fill } from "react-icons/ri";
import { FaBell } from "react-icons/fa";
import { BiTrip } from "react-icons/bi";
import { FaTruck } from "react-icons/fa6";
import { Providers } from "./providers";
import { FaFileInvoice } from "react-icons/fa";
import { BsFillPeopleFill } from "react-icons/bs";
import { Toaster } from "@/components/ui/toaster";
import NavBar from "@/components/NavBar";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";
import { Metadata } from "next";
import { LoginButton } from "./auth";
import SideBar from "@/components/SideBar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const inter = Inter({ subsets: ["latin"] });
const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FleetIQ",
  description: "FleetIQ - Your Ultimate Fleet Management Solution",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch session on server side
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    // Render a landing page for non-authenticated users
    return (
      <html lang="en">
        <body
          className={`${outfit.className} bg-gradient-to-r from-blue-400 to-purple-600 text-white`}
        >
          <div className="flex flex-col items-center justify-center h-screen text-center px-6 py-12">
            <h1 className="text-5xl font-extrabold mb-6">Welcome to FleetIQ</h1>
            <p className="text-lg mb-8 max-w-lg mx-auto">
              FleetIQ is your ultimate fleet management solution. Optimize,
              track, and manage your fleet with ease.
            </p>
            <div className="flex gap-5">
              <LoginButton />
              <Link href="/register">
                <Button>Sign up</Button>
              </Link>
            </div>

            <div className="mt-8 text-sm">
              <p>© 2024 FleetIQ. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <Providers>
        <body className={`${outfit.className}`}>
          <SideBar
            links={[
              { name: "Dashboard", icon: <RiBarChart2Fill /> },
              { name: "Parties", icon: <BsFillPeopleFill /> },
              { name: "Vendors", icon: <BsFillPeopleFill /> },
              { name: "Trips", icon: <BiTrip /> },
              { name: "Drivers", icon: <BsFillPeopleFill /> },
              { name: "Trucks", icon: <FaTruck /> },
              { name: "Remainders", icon: <FaBell /> },
              { name: "Reports", icon: <FaFileInvoice /> },
            ]}
          />
          <div className="bg-[#F6F6F6] p-5 w-[87vw] h-[100vh] right-0 absolute">
            <div className="flex flex-col p-8 bg-white w-full rounded-lg shadow-lg">
              <NavBar />
              {children}
            </div>
          </div>
          <Toaster />
        </body>
      </Providers>
    </html>
  );
}
