import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import Link from "next/link"
import { sidebarMenuItems } from "../app/(dashboardGroup)/_config/sidebarMenuItems";

export type IUserResponse = {
  message: string;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      role: keyof typeof sidebarMenuItems; // "TENANT" | "LANDLORD" | "ADMIN"
      status: string;
      profileImage?: string | null;
      createdAt: string;
      updatedAt: string;
    };
  };
};

type DashboardDrawerProps = {
  user: IUserResponse | null;
};

export function DashboardDrawer({ user }: DashboardDrawerProps) {
  const profile = user?.data?.user;
  const role = profile?.role;

  // ১. ইউজারের রোল অনুযায়ী সঠিক সাইডবার আইটেমগুলো তুলে নেওয়া (যদি রোল না থাকে ডিফল্ট TENANT ধরতে পারেন)
  const menuItems = (role && sidebarMenuItems[role]) ? sidebarMenuItems[role] : sidebarMenuItems["TENANT"];

  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm" className="font-semibold shadow-sm">
          📂 Menu
        </Button>
      </DrawerTrigger>

      <DrawerContent className="h-full flex flex-col justify-between">
        <div>
          <DrawerHeader className="border-b pb-4">
            <DrawerTitle className="text-xl font-bold text-gray-900">
              RentNest Dashboard
            </DrawerTitle>
            <DrawerDescription className="text-xs text-gray-500">
              Role: <span className="font-semibold text-blue-600">{role || "User"}</span>
            </DrawerDescription>
          </DrawerHeader>

          {/* ২. ডাইনামিকভাবে ম্যাপ করে সাইডবার আইটেমগুলো রেন্ডার করা */}
          <div className="flex flex-col gap-2 p-4">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <DrawerClose asChild key={index}> 
                  <Link 
                    href={item.href} 
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                  >
                    {IconComponent && <IconComponent className="w-4 h-4" />}
                    <span>{item.label}</span>
                  </Link>
                </DrawerClose>
              );
            })}
          </div>
        </div>

        <DrawerFooter className="border-t pt-4">
          <DrawerClose asChild>
            <Button variant="destructive" className="w-full">
              Close Menu
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}