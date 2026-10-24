"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const BASE_API = process.env.NEXT_PUBLIC_BASE_API || "http://localhost:3000";

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || cookieStore.get("accessToken")?.value;

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token || ""}`,
  };
}

// 1. POST: Create a new property
export async function createProperty(propertyData: unknown) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_API}/api/landlord/properties`, {
      method: "POST",
      headers,
      body: JSON.stringify(propertyData),
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to create property");
    }

    revalidatePath("/dashboard/landlord/properties");
    return { success: true, data: result.data, message: result.message };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Something went wrong";
    return { success: false, message: errorMessage };
  }
}

// 2. PUT: Update an existing property
export async function updateProperty(id: string, propertyData: unknown) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_API}/api/landlord/properties/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(propertyData),
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to update property");
    }

    revalidatePath("/dashboard/landlord/properties");
    return { success: true, data: result.data, message: result.message };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Something went wrong";
    return { success: false, message: errorMessage };
  }
}

// 3. DELETE: Remove a property
export async function deleteProperty(id: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_API}/api/landlord/properties/${id}`, {
      method: "DELETE",
      headers,
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to delete property");
    }

    revalidatePath("/dashboard/landlord/properties");
    return { success: true, message: result.message || "Property deleted successfully" };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Something went wrong";
    return { success: false, message: errorMessage };
  }
}




// 5. PATCH: Update rental request status (PENDING / APPROVED / REJECTED)
// Equivalent to PATCH /api/landlord/requests/:id
export async function updateRentalRequestStatus(id: string, status: "PENDING" | "APPROVED" | "REJECTED") {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_API}/api/landlord/requests/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status }),
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to update request status");
    }

    return { success: true, data: result.data, message: result.message };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Something went wrong";
    return { success: false, message: errorMessage };
  }
}

// 6. GET: Fetch all categories for property creation dropdown
export async function getCategories() {
  try {
    const res = await fetch(`${BASE_API}/api/categories`, {
      method: "GET",
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch categories");
    }

    return { success: true, data: result.data || [] };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Something went wrong";
    return { success: false, message: errorMessage, data: [] };
  }
}

export async function getLandlordRequests() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_API}/api/landlord/requests`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch rental requests");
    }

    return { success: true, data: result.data || [] };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Something went wrong";
    return { success: false, message: errorMessage, data: [] };
  }
}
// 8. GET: Fetch all properties owned by the landlord
export async function getLandlordProperties() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_API}/api/landlord/properties`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch properties");
    }

    return { success: true, data: result.data || [] };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Something went wrong";
    return { success: false, message: errorMessage, data: [] };
  }
}