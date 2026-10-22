"use server";

import { jwtUtils } from "@/app/utils/jwt";
import { cookies } from "next/headers";

export const getNewAccessToken = async () => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return {
      success: false,
      message: "Refresh Token not found",
    };
  }

  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/auth/refresh-token`,
      {
        method: "POST",
        headers: {
          // Note: Check if your backend expects Authorization: Bearer <token> 
          // or just refreshToken=<token>. Keeping your original header format:
          Authorization: `refreshToken=${refreshToken}`,
        },
        cache: "no-store",
      }
    );

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return { success: false, message: "Network or server error" };
  }
};

export const isAccessTokenExits = async () => {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
    
  if (!accessToken && !refreshToken) {
    return {
      success: false,
      message: "User not Logged In",
    };
  }

  const decodedAccessToken = accessToken 
    ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string) 
    : null;
  
  const decodedRefreshToken = refreshToken 
    ? jwtUtils.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET as string) 
    : null;

  // If access token is invalid/expired, but refresh token is valid
  if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
    const result = await getNewAccessToken();

    if (result.success && result.data?.accessToken) {
      const newAccessToken = result.data.accessToken;

      // Set the new access token in cookies
      cookieStore.set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 day
        sameSite: "lax",
        path: "/",
      });

      accessToken = newAccessToken;
    } else {
      // Refresh token failed or expired on backend
      return {
        success: false,
        message: "Session expired. Please log in again.",
      };
    }
  }

  // Final check: if we successfully have a valid access token now
  if (accessToken) {
    return {
      success: true,
      accessToken,
    };
  }

  return {
    success: false,
    message: "User not Logged In",
  };
};