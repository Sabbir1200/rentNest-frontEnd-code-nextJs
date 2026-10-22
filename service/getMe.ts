"use server";

import { cookies } from "next/headers";

export const getMe = async () => {
  
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || null;

  if (!accessToken) {
    return {
      success: false,
      message: "User not logged in!",
    };
  }

  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // 🔴 এখানে "Bearer " শব্দটি যুক্ত করে দিন (পোস্টম্যান এটি স্বয়ংক্রিয়ভাবে করে)
        Authorization: `Bearer ${accessToken}`, 
        Cookie: `accessToken=${accessToken}`,
      },
      cache: "no-store",
    });

    // যদি ব্যাকএন্ড স্ট্যাটাস কোড দেখতে চান কেন ফেইল করছে:
    if (!res.ok) {
      const errorResponse = await res.text();
      console.log("BACKEND_ERROR_STATUS:", res.status, errorResponse);
      
      return {
        success: false,
        message: "Failed to fetch user",
      };
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("GET_ME_EXCEPTION:", error);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
};