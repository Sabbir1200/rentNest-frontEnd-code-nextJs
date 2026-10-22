import { Navbar } from "@/components/shared/navbar";
import { getMe } from "@/service/getMe";
import { DashboardDrawer } from "@/components/DashboardDrawer";
import { Suspense } from "react";

// ১. ডেটা ফেচ করার জন্য একটি আলাদা অ্যাসিনক্রোনাস সাব-কম্পোনেন্ট তৈরি করা হলো
async function DashboardHeaderSection() {
    const user = await getMe();

    return (
        <>
           
            <Navbar user={user} />

            
            <div className="p-4 border-b bg-white flex items-center justify-between  shadow-sm">
                <span className="font-bold text-gray-700">Dashboard Menu</span>
                <DashboardDrawer user={user} />
            </div>
        </>
    );
}


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
           
            <Suspense fallback={<div className="h-16 border-b bg-white" />}>
                <DashboardHeaderSection />
            </Suspense>

            
            <div className="flex flex-1">
                <main className="flex-1 min-w-0 p-6">{children}</main>
            </div>
        </div>
    );
}