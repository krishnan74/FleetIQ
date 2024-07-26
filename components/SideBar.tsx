"use client";

import Link from "next/link";
import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface SideBarProps {
  links: TabDetails[];
}

interface TabDetails {
  name: string;
  icon: React.ReactNode;
}

const SideBar: React.FC<SideBarProps> = ({ links }) => {
  const pathname = usePathname();
  const path = pathname.split("/")[1];
  const colorHex = "bg-[#FF7C51]";

  console.log(pathname);
  return (
    <div className="flex flex-col  gap-3 left-0 h-[100vh] fixed bg-[#F6F6F6] w-[13vw] border text-black">
      <h1 className="text-2xl font-bold tracking-wider text-center mt-10 mb-10">
        FleetIQ
      </h1>
      <div className="flex flex-col  gap-3 pr-2">
        {links.map((link) => (
          <Link
            href={`/${link.name.toLowerCase()}`}
            className={`flex gap-4 pl-10 w-[200px] py-4 items-center text-black rounded-br-lg rounded-tr-lg ${
              path == link.name.toLowerCase()
                ? colorHex + "  text-white"
                : "bg-transparent"
            }    `}
            key={link.name}
          >
            {link.icon}
            <p className={`font-semibold`}>{link.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
