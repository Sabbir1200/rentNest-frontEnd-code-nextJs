"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import jwt, { JwtPayload } from "jsonwebtoken"

export type LoginState = {
  success: boolean;
  statusCode: number;
  message: string;
  data?: {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      createdAt: string;
      updatedAt: string;
    };
    accessToken: string;
    refreshToken: string;
  };
}

export const loginAction = async (prevState: LoginState, formData: FormData): Promise<LoginState> => {
  const email = formData.get("email");
  const password = formData.get("password");
  
  const payload = { email, password };

  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    // ব্যাকএন্ড থেকে যদি এরর আসে (যেমন: 401 Invalid email or password)
    if (!res.ok) {
      return {
        success: false,
        statusCode: res.status,
        message: result.message || "Login failed",
      };
    }

    // ব্যাকএন্ডের রেসপন্সে সরাসরি `result.accessToken` বা `result.data.accessToken` থাকতে পারে।
    // তোমার ব্যাকএন্ড কোড অনুযায়ী রেসপন্স স্ট্রাকচার হলো: { user, accessToken, refreshToken }
    const accessToken = result.accessToken || result.data?.accessToken;
    const refreshToken = result.refreshToken || result.data?.refreshToken;
    const userRole = result.user?.role || result.data?.user?.role;

    if (!accessToken) {
      return {
        success: false,
        statusCode: 400,
        message: "Access token not found in response",
      };
    }

    // কুকি সেট করা
    const cookieStore = await cookies();

    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // ১ দিন
      sameSite: "lax",
      path: "/",
    });

    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // ৭ দিন
      sameSite: "lax",
      path: "/",
    });

    // রোল অনুযায়ী রিডাইরেক্ট হ্যান্ডেল করা
    if (!userRole) {
      redirect("/register");
    } else if (userRole === "ADMIN") {
      // redirect("/admin-dashboard");
      redirect("/");
    } else if (userRole === "LANDLORD") {
      // redirect("/landlord-dashboard");
      redirect("/");
    } else if (userRole === "AUTHOR") {
      // redirect("/author-dashboard");
      redirect("/");
    } else {
      redirect("/dashboard");
    }

  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }

    return {
      success: false,
      statusCode: 500,
      message: "Unable to connect to the server",
    };
  }
};
export interface RegisterState {
  success: boolean;
  statusCode: number;
  message: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
  };
}

export const registerAction = async (
  redirectTo: string,
  prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> => {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const role = formData.get("role") || "USER";
  const phone = formData.get("phone");
  const profileImage = formData.get("profileImage");

  // Validate required fields
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    !name.trim() ||
    !email.trim() ||
    !password
  ) {
    return {
      success: false,
      statusCode: 400,
      message: "All required fields must be provided",
    };
  }

  const requestBody: Record<string, unknown> = {
    name,
    email,
    password,
    role,
  };

  if (typeof phone === "string" && phone.trim()) {
    requestBody.phone = phone.trim();
  }

  if (typeof profileImage === "string" && profileImage.trim()) {
    requestBody.profileImage = profileImage.trim();
  }

  let result: RegisterState;

  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    

   const resJson = await res.json();

    // 🔴 এখানে `!res.ok` এর পাশাপাশি ব্যাকএন্ডের `resJson.success === false` ও চেক করুন
    if (!res.ok || resJson.success === false) {
      return {
        success: false,
        statusCode: resJson.statusCode || res.status,
        message: resJson.message || " Registration failed",
      };
    }

    result = {
      success: true,
      statusCode: res.status,
      message: resJson.message || "Registration successful",
      data: resJson.data,
    };
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }

    return {
      success: false,
      statusCode: 500,
      message: "Unable to connect to the server",
    };
  }

  // সফলভাবে রেজিস্টার হওয়ার পর কুকি সেট না করেই সরাসরি রিডাইরেক্ট হবে
  if (
    redirectTo &&
    redirectTo.startsWith("/") &&
    !redirectTo.startsWith("//")
  ) {
    redirect(redirectTo);
  }

  redirect("/login");
};