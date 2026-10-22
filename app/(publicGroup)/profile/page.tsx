import React from "react";
import { unstable_noStore as noStore } from "next/cache";
import { getMe } from "@/service/getMe";


export const instant = false;

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  profileImage: string | null;
}

export default async function ProfilePage() {
  noStore(); // Prerender blocking এড়াতে

  let user: UserProfile | null = null;
  let errorMessage = "";

  try {
    const response = await getMe();
    console.log("Profile API Response:", response);

    // 🔴 এখানে রেসপন্স থেকে সরাসরি user অবজেক্টটি তুলে নেওয়া হলো
    if (response?.data?.user) {
      user = response.data.user;
    } else {
      errorMessage = response?.message || "Failed to load user profile.";
    }
  } catch (error) {
    console.error("Profile page error:", error);
    errorMessage = "Something went wrong while loading profile.";
  }

  
  if (!user) {
    return (
      <main className="max-w-4xl mx-auto p-6 min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-6 rounded-xl text-center shadow-sm max-w-md w-full">
          <p className="font-bold text-lg">Access Denied / Not Logged In</p>
          <p className="text-sm mt-1 text-red-600">{errorMessage}</p>
          <a 
            href="/login" 
            className="inline-block mt-5 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition shadow"
          >
            Go to Login
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-6 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">
          My Profile
        </h1>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold shadow-inner">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
              <span className="inline-block mt-1 text-xs px-3 py-1 rounded-full font-semibold bg-green-100 text-green-800">
                {user.status} • {user.role}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
            <div>
              <label className="text-sm font-medium text-gray-500 block">Email Address</label>
              <p className="text-base font-semibold text-gray-800 mt-1">{user.email}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 block">Phone Number</label>
              <p className="text-base font-semibold text-gray-800 mt-1">{user.phone || "N/A"}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 block">Role</label>
              <p className="text-base font-semibold text-gray-800 mt-1">{user.role}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 block">Account Status</label>
              <p className="text-base font-semibold text-gray-800 mt-1">{user.status}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}