export const getFeaturedProperties = async () => {
  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/properties`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
     
      cache: "no-store", 
    });

    if (!res.ok) {
      throw new Error("Failed to fetch properties");
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error fetching properties:", error);
    return { success: false, data: { properties: [] } };
  }
};

export const getPropertyById = async (id: string) => {
  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/properties/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
     
      next: { revalidate: 10 }, 
    });

    if (!res.ok) {
      throw new Error("Failed to fetch property details");
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error fetching property by ID:", error);
    return { success: false, data: { property: null } };
  }
};