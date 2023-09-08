"use client";

import Image from "next/image";
import React from "react";
import Link from "next/link";

// icons
import Logo from "../../../../public/imgs/logo.svg";
import DashboardIcon from "../../../../public/imgs/user-dashboard.svg";
import DashboardIconActive from "../../../../public/imgs/user-dashboard-active.svg";
import WashProsIcon from "../../../../public/imgs/user-washpros.svg";
import WashProsIconActive from "../../../../public/imgs/user-washpros-active.svg";
import CustomersIcon from "../../../../public/imgs/user-customers.svg";
import CustomersIconActive from "../../../../public/imgs/user-customer-active.svg";
import CalendarIcon from "../../../../public/imgs/user-calender.svg";
import CalendarIconActive from "../../../../public/imgs/user-calender-active.svg";
import LedgerIcon from "../../../../public/imgs/user-ledger.svg";
import LedgerIconActive from "../../../../public/imgs/user-ledger-active.svg";
import LogoutIcon from "../../../../public/imgs/logout.svg";
import { useRouter } from "next/navigation";
import Chip from "@/app/components/Chip";

interface IProfile {
  name: string;
  img: string;
}
interface ILayout {
  currentOption: number;
  children: React.ReactNode;
  profile: IProfile;
}
function Layout(props: ILayout) {
  const router = useRouter();
  const { currentOption, children, profile } = props;

  const onLogout = () => {
    router.push("/login");
  };
  const renderOptions = () => {
    return [
      {
        icon: DashboardIcon,
        activeIcon: DashboardIconActive,
        label: "Dashboard",
        route: "/user/dashboard",
      },
      {
        icon: WashProsIcon,
        activeIcon: WashProsIconActive,
        label: "Wash Pros",
        route: "/user/wash-pros",
      },
      {
        icon: CustomersIcon,
        activeIcon: CustomersIconActive,
        label: "Customers",
        route: "/user/customers",
      },
      {
        icon: CalendarIcon,
        activeIcon: CalendarIconActive,
        label: "Calendar",
        route: "/user/calendar",
      },
      {
        icon: LedgerIcon,
        activeIcon: LedgerIconActive,
        label: "Ledger",
        route: "/user/ledger",
      },
    ].map((option, i) => {
      const { icon, activeIcon, label, route } = option;
      return (
        <Link href={route} key={i}>
          <li
            key={i}
            className={`flex items-center cursor-pointer p-3 rounded-2xl mb-2 ${
              currentOption === i ? "bg-primary-color mb-3" : ""
            }`}
          >
            <Image src={currentOption === i ? activeIcon : icon} alt={label} />
            <span
              className={`paragraph-1 text-sm ml-2 font-medium ${
                currentOption === i && "text-white	"
              }`}
            >
              {label}
            </span>
          </li>
        </Link>
      );
    });
  };
  return (
    <div className="flex">
      <div className="w-[260px]">
        <Image src={Logo} alt="washmyt" />
        <div className="min-h-[600px] relative mt-8">
          <ul>{renderOptions()}</ul>
          <div className="absolute bottom-0">
            <div className="flex items-center mb-7 cursor-pointer">
              <Image
                src={profile.img}
                alt={profile.name}
                width={45}
                height={45}
                className="rounded-full"
              />
              <span className="paragraph-1 text-sm ml-2 font-bold">
                {profile.name}
              </span>
              <Chip text="Admin" className="ml-6 !text-[10px]" />
            </div>
            <div className="flex items-center ml-2 cursor-pointer">
              <Image src={LogoutIcon} alt="logout" />
              <span
                onClick={onLogout}
                className="paragraph-1 text-sm ml-5 font-medium"
              >
                Logout
              </span>
            </div>
            <p className="text-sm text-primary-gray ml-2 mt-6 opacity-60">
              v 2.5.1
            </p>
          </div>
        </div>
      </div>
      <div className="w-full mt-8 ml-7">{children}</div>
    </div>
  );
}

export default Layout;
