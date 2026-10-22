import Link from "next/link";
import { getFeaturedProperties } from "./_actions/property";



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
export const instant = false;
export default async function HomePage() {
 
  const response = await getFeaturedProperties();
  

  const properties: Property[] = response?.data?.properties || [];

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          Find Your Dream Property in Khulna
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Explore our handpicked featured properties for rent.
        </p>
      </section>

      {/* Featured Properties Section */}
      <section className="max-w-7xl mx-auto py-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Featured Properties
        </h2>

        {properties.length === 0 ? (
          <p className="text-gray-500">No properties available right now.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {properties.map((property: Property) => (
              <div 
                key={property.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col justify-between"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-900">
                      {property.title}
                    </h3>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-semibold">
                      {property.isAvailable ? "Available" : "Booked"}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-3">
                    📍 {property.address}, {property.city}
                  </p>

                  <p className="text-gray-500 text-xs mb-4 line-clamp-2">
                    {property.description}
                  </p>
                </div>

                <div className="px-5 pb-5 flex justify-between items-center border-t border-gray-100 pt-3">
                  <span className="text-blue-600 font-bold text-lg">
                    ৳{property.rentAmount} <span className="text-xs text-gray-500 font-normal">/month</span>
                  </span>
                  
                  <Link 
                    href={`/properties/${property.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}