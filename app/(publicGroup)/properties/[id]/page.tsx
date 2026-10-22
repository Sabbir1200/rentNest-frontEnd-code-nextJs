import { getPropertyById } from "@/app/(publicGroup)/_actions/property";
import { notFound } from "next/navigation";
import RequestBookingButton from "@/components/RequestBookingButton";
import { unstable_noStore as noStore } from "next/cache";

// 🔴 এই লাইনটি যোগ করুন যা cacheComponents-কে জানাবে যে এটি একটি ব্লকিং/ডাইনামিক রুট
export const instant = false;

interface Property {
  id: string;
  landlordId: string;
  categoryId: string;
  title: string;
  description: string;
  address: string;
  city: string;
  rentAmount: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/properties`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const result = await res.json();
    const properties = result?.data?.properties || [];

    if (properties.length > 0) {
      return properties.map((property: { id: string }) => ({
        id: property.id,
      }));
    }
  } catch (error) {
    console.error("Failed to generate static params:", error);
  }

  return [{ id: "placeholder-id" }];
}

export default async function PropertyDetailsPage({ params }: PageProps) {
  noStore(); 

  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const response = await getPropertyById(id);
  const property: Property | null = response?.data?.property || null;

  if (!property) {
    notFound();
  }

  return (
    <main className="max-w-5xl mx-auto p-6 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden p-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b pb-6">
          <div>
            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
              property.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}>
              {property.isAvailable ? "Available for Rent" : "Already Booked"}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">
              {property.title}
            </h1>
            <p className="text-gray-600 mt-1">
              📍 {property.address}, {property.city}
            </p>
          </div>

          <div className="text-right">
            <span className="text-3xl font-bold text-blue-600">
              ৳{property.rentAmount}
            </span>
            <span className="text-gray-500 text-sm block">/ month</span>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Description</h2>
          <p className="text-gray-600 leading-relaxed">
            {property.description}
          </p>
        </div>

        <div className="border-t pt-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Interested in this property?</p>
            <p className="text-xs text-gray-400">Send a booking request to the landlord directly.</p>
          </div>

          <RequestBookingButton propertyId={property.id} isAvailable={property.isAvailable} />
        </div>

      </div>
    </main>
  );
}