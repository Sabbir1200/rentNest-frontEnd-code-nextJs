import React from "react";
import { 
  Building2, 
  Clock, 
  CheckCircle2, 
  CreditCard, 
  ArrowUpRight, 
  MapPin, 
  Calendar 
} from "lucide-react";
import Link from "next/link";

const TenantDashboardPage = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Tenant Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Welcome back! Track your rental requests, active bookings, and payment status.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/properties"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition"
          >
            Explore Properties
          </Link>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Active Stays / Bookings */}
        <div className="overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Rentals</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">1</h3>
            </div>
            <div className="rounded-full bg-blue-50 p-3 text-blue-600">
              <Building2 className="w-6 h-6" />
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-400">Current home in Khulna</p>
        </div>

        {/* Pending Requests */}
        <div className="overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Requests</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">2</h3>
            </div>
            <div className="rounded-full bg-amber-50 p-3 text-amber-600">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <p className="mt-4 text-xs text-amber-600 font-medium">Awaiting landlord approval</p>
        </div>

        {/* Total Bookings */}
        <div className="overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Approved Bookings</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">3</h3>
            </div>
            <div className="rounded-full bg-emerald-50 p-3 text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-400">Total successful stays</p>
        </div>

        {/* Monthly Rent */}
        <div className="overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Monthly Rent</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">৳15,000</h3>
            </div>
            <div className="rounded-full bg-purple-50 p-3 text-purple-600">
              <CreditCard className="w-6 h-6" />
            </div>
          </div>
          <p className="mt-4 text-xs text-emerald-600 font-semibold">Paid for this month</p>
        </div>
      </div>

      {/* Main Content Grid: Current Property & Recent Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Current Active Residence (Left 2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Current Residence</h2>
              <span className="px-3 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                Active Stay
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <div className="w-full sm:w-48 h-32 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 border overflow-hidden">
                <Building2 className="w-10 h-10 text-gray-400" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900">Green Valley Luxury Apartment</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-blue-600" /> Alir Club Mor, Khulna
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-600 pt-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" /> Move-in: Jan 2026
                  </span>
                  <span className="font-semibold text-gray-900">৳15,000 / month</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-gray-500">Landlord: <strong className="text-gray-800">Rahim Uddin</strong></span>
            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              Contact Landlord <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Actions / Request Status (Right 1 col) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-4 mb-4">
              Recent Requests
            </h2>

            <div className="space-y-4">
              {/* Request Item 1 */}
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-800 truncate">Sunset Heights Studio</h4>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-700 rounded">
                    PENDING
                  </span>
                </div>
                <p className="text-xs text-gray-500">Requested: Oct 2026</p>
              </div>

              {/* Request Item 2 */}
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-800 truncate">Central City Flat</h4>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded">
                    APPROVED
                  </span>
                </div>
                <p className="text-xs text-gray-500">Requested: Sep 2026</p>
              </div>
            </div>
          </div>

          <Link
            href="/dashboard/my-posts"
            className="mt-6 text-center text-xs font-semibold text-blue-600 hover:underline block"
          >
            View all booking requests →
          </Link>
        </div>

      </div>
    </div>
  );
};

export default TenantDashboardPage;