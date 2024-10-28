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
    return (
      <html lang="en">
        <Providers>
          <body className={`${outfit.className}`}>{children}</body>
        </Providers>
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
              { name: "Invoice", icon: <FaFileInvoice /> },
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
