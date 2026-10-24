"use client";

import { RentalRequest } from "@/lib/types";
import { useEffect, useState } from "react";

import { 
  Eye, 
  Loader2, 
  FileText, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Building2, 
  Calendar, 
  CreditCard 
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getSingleRentalRequest, getTenantRentals } from "../../_actions/tenant.actions";

export default function TenantDashboardPage() {
  const [rentals, setRentals] = useState<RentalRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // View Details Modal State
  const [selectedRequest, setSelectedRequest] = useState<RentalRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [detailsLoading, setDetailsLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadRentals = async () => {
      try {
        const result = await getTenantRentals();
        setRentals(result.data || []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    loadRentals();
  }, []);

  // Handle View Details Click
  const handleViewDetails = async (id: string) => {
    setDetailsLoading(true);
    setIsModalOpen(true);
    try {
      const result = await getSingleRentalRequest(id);
      if (result.success && result.data) {
        setSelectedRequest(result.data);
      } else {
        setError(result.message || "Failed to load details");
      }
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setDetailsLoading(false);
    }
  };

  // Summary Calculations
  const activeRentalsCount = rentals.filter((r) => r.status === "ACTIVE").length;
  const totalSpent = rentals.reduce((sum, item) => sum + Number(item.totalAmount || 0), 0);

  // Status Badge Helper Function with Icons
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" /> Active
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
      case "REJECTED":
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-full">
            <XCircle className="w-3.5 h-3.5" /> {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-full">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-gray-500 font-medium text-sm">Loading your rental overview...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-start gap-3 shadow-sm">
          <XCircle className="w-5 h-5 text-rose-600 mt-0.5" />
          <div>
            <p className="font-semibold">Something went wrong</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 bg-gray-50/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Tenant Overview & History
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track your property rental requests, statuses, and active agreements seamlessly.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="p-6 bg-white border border-gray-200/80 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Active Rentals</p>
            <p className="mt-2 text-3xl font-black text-gray-900">{activeRentalsCount}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 bg-white border border-gray-200/80 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Commitment Amount</p>
            <p className="mt-2 text-3xl font-black text-gray-900">৳{totalSpent.toLocaleString()}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Request History Section */}
      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Request History</h2>
            <p className="text-xs text-gray-500 mt-0.5">All your past and ongoing rental applications</p>
          </div>
          <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
            Total: {rentals.length}
          </span>
        </div>

        {rentals.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-gray-600 font-medium">No rental requests found.</p>
            <p className="text-xs text-gray-400 max-w-xs">You haven&apos;t made any rental requests yet. Explore properties and submit a request to see them here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/70 text-gray-700 font-semibold uppercase tracking-wider text-xs border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Property</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Rent / Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rentals.map((rental) => (
                  <tr key={rental.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {rental.property?.title || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {rental.property?.address ? `${rental.property.address}, ${rental.property?.city || ""}` : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <span className="font-bold text-gray-900">
                          ৳{Number(rental.totalAmount || 0).toLocaleString()}
                        </span>
                        <span className="text-[11px] text-gray-400 block font-normal">
                          (৳{Number(rental.property?.rentAmount || 0).toLocaleString()}/mo)
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(rental.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(rental.id)}
                        className="h-8 gap-1.5 text-xs font-semibold text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAILS MODAL / DIALOG */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg p-6 rounded-2xl bg-white shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">Rental Request Details</DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Detailed view of the selected rental agreement and property info.
            </DialogDescription>
          </DialogHeader>

          {detailsLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <p className="text-xs text-gray-500 font-medium">Fetching details...</p>
            </div>
          ) : selectedRequest ? (
            <div className="space-y-4 py-2 text-sm">
              {/* Property Info Card */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  {selectedRequest.property?.title || "Property Name N/A"}
                </h4>
                <p className="text-xs text-gray-500">
                  {selectedRequest.property?.address}, {selectedRequest.property?.city}
                </p>
              </div>

              {/* Grid Information */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white border border-gray-100 rounded-xl shadow-2xs">
                  <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider block">Status</span>
                  <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                </div>
                <div className="p-3 bg-white border border-gray-100 rounded-xl shadow-2xs">
                  <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider block">Total Amount</span>
                  <span className="mt-1 font-bold text-gray-900 block text-base">
                    ৳{Number(selectedRequest.totalAmount || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Duration & Date */}
              <div className="p-3 bg-white border border-gray-100 rounded-xl space-y-1">
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider block">Rental Duration</span>
                <p className="text-xs font-semibold text-gray-800">
                  {new Date(selectedRequest.startDate).toLocaleDateString()} &rarr; {new Date(selectedRequest.endDate).toLocaleDateString()}
                </p>
              </div>

              {/* Message Box */}
              {selectedRequest.message && (
                <div className="p-3 bg-white border border-gray-100 rounded-xl space-y-1">
                  <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider block">Your Note / Message</span>
                  <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                    {selectedRequest.message}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-6">No data found.</p>
          )}

          <DialogFooter className="pt-2">
            <Button 
              variant="outline" 
              onClick={() => setIsModalOpen(false)}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}