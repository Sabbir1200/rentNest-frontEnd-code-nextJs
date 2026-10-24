"use server";

import { ApiResponse } from "@/lib/types";
import { cookies } from "next/headers";


export async function getTenantRentals(): Promise<ApiResponse> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value; // 👈 Cookie theke accessToken get korlam

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/rentals`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`, // 👈 Postman er moto Authorization header dilam
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch: ${errorText || response.statusText}`);
    }

    const result: ApiResponse = await response.json();
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred");
  }
}



export interface IRentalRequest {
  id: string;
  status: string;
  rentAmount?: number;
  message?: string;
  createdAt: string;
  houseTitle?: string;
}

export async function getSingleRentalRequest(id: string) {
  try {
    
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value; 

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/rentals/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch rental details");
    }

    return { success: true, data: result.data };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Something went wrong";
    return { success: false, message: errorMessage };
  }
}