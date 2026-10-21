import { Navbar } from "@/components/shared/navbar";
import { getMe } from "@/service/getMe";
import { Suspense } from "react";

// আলাদা একটি কম্পোনেন্ট বানিয়ে সেখানে ডেটা ফেচ করা হলো
async function NavbarWrapper() {
    const user = await getMe();
    console.log("PublicGroupLayout user:", user);
    return <Navbar user={user} />;
}

const PublicGroupLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
  return (
    <div>
      {/* Suspense দিয়ে মুড়ে দেওয়া হলো যাতে প্রি-রেন্ডারিং ব্লক না হয় */}
      <Suspense fallback={<div className="h-16 border-b bg-background" />}>
        <NavbarWrapper />
      </Suspense>
      {children}
    </div>
  );
}

export default PublicGroupLayout;