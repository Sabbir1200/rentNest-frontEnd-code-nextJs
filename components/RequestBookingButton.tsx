"use client";

import { useState } from "react";

interface Props {
  propertyId: string;
  isAvailable: boolean;
}

export default function RequestBookingButton({ propertyId, isAvailable }: Props) {
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(false);

  const handleBookingRequest = async () => {
    setLoading(true);
    try {
      
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000"}/api/booking-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          
        },
        body: JSON.stringify({ propertyId }),
      });

      const result = await res.json();

      if (res.ok) {
        alert("Booking request sent successfully!");
        setRequested(true);
      } else {
        alert(result.message || "Failed to send request");
      }
    } catch (error) {
      console.error("Error sending request:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!isAvailable) {
    return (
      <button disabled className="bg-gray-300 text-gray-600 px-6 py-3 rounded-lg cursor-not-allowed font-medium">
        Not Available
      </button>
    );
  }

  return (
    <button
      onClick={handleBookingRequest}
      disabled={loading || requested}
      className={`px-6 py-3 rounded-lg text-white font-medium transition ${
        requested 
          ? "bg-green-600 cursor-default" 
          : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      {loading ? "Sending..." : requested ? "Request Sent ✓" : "Request Property"}
    </button>
  );
}