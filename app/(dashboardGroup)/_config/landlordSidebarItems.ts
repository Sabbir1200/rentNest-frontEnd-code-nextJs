import { ISidebarItem } from "@/lib/types";
import {  House, LayoutDashboard } from "lucide-react";

export const LANDLORD_SIDEBAR_ITEMS: ISidebarItem[] = [
    {
        label: "Dashboard",
        href: "/landlord-dashboard",
        icon: LayoutDashboard
    },
    {
        label: "My Posts",
        href: "/landlord-dashboard/my-landPost",
        icon: House
    },
]