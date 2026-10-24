import { ISidebarItem } from "@/lib/types"
import { CreditCard, FileText, LayoutDashboard } from "lucide-react"
import { ADMIN_SIDEBAR_ITEMS } from "./adminSidebarItems"

import { LANDLORD_SIDEBAR_ITEMS } from "./landlordSidebarItems"


const TENANT_SIDEBAR_ITEMS : ISidebarItem[] = [
    {
        label : "Dashboard",
        href : "/dashboard",
        icon : LayoutDashboard
    },
    {
        label : "My Rental Req",
        href : "/dashboard/my-rental",
        icon : FileText
    },
    {
        label : "My payment ",
        href : "/dashboard/my-payment",
        icon : CreditCard
    },
]


export const sidebarMenuItems = {
    LANDLORD: LANDLORD_SIDEBAR_ITEMS,
    TENANT :TENANT_SIDEBAR_ITEMS,
    ADMIN : ADMIN_SIDEBAR_ITEMS
}