import { ISidebarItem } from "@/lib/types"
import { FileText, LayoutDashboard } from "lucide-react"
import { ADMIN_SIDEBAR_ITEMS } from "./adminSidebarItems"

import { LANDLORD_SIDEBAR_ITEMS } from "./landlordSidebarItems"


const TENANT_SIDEBAR_ITEMS : ISidebarItem[] = [
    {
        label : "Dashboard",
        href : "/dashboard",
        icon : LayoutDashboard
    },
    {
        label : "My Posts",
        href : "/dashboard/my-posts",
        icon : FileText
    },
]


export const sidebarMenuItems = {
    LANDLORD: LANDLORD_SIDEBAR_ITEMS,
    TENANT :TENANT_SIDEBAR_ITEMS,
    ADMIN : ADMIN_SIDEBAR_ITEMS
}