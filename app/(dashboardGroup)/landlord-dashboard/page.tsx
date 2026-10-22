import React from "react";
import { 
  Building, 
  Users, 
  DollarSign, 
  Clock, 
  Plus, 
  ArrowUpRight, 
  MapPin, 
  CheckCircle,
  XCircle
} from "lucide-react";
import Link from "next/link";

const LandlordDashboardPage = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Landlord Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Overview of your rental properties, tenant requests, and total monthly income.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/add-property"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 transition"
          >
            <Plus className="w-4 h-4" /> Add New Property
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Properties */}
        <div className="overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">My Properties</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">8</h3>
            </div>
            <div className="rounded-full bg-blue-50 p-3 text-blue-600">
              <Building className="w-6 h-6" />
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-400">6 Occupied · 2 Vacant</p>
        </div>

        {/* Active Tenants */}
        <div className="overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Tenants</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">6</h3>
            </div>
            <div className="rounded-full bg-emerald-50 p-3 text-emerald-600">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <p className="mt-4 text-xs text-emerald-600 font-medium">All lease agreements active</p>
        </div>

        {/* Total Monthly Income */}
        <div className="overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Monthly Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">৳95,000</h3>
            </div>
            <div className="rounded-full bg-purple-50 p-3 text-purple-600">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-400">Estimated monthly collection</p>
        </div>

        {/* Pending Booking Requests */}
        <div className="overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Requests</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">4</h3>
            </div>
            <div className="rounded-full bg-amber-50 p-3 text-amber-600">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <p className="mt-4 text-xs text-amber-600 font-medium">Requires your review</p>
        </div>
      </div>

      {/* Main Grid: Rental Requests & Listed Properties */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Tenant Booking Requests (Left 2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Pending Rental Requests</h2>
              <p className="text-xs text-gray-500">Review and accept tenant booking applications</p>
            </div>
            <Link
              href="/dashboard/requests"
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {/* Request Card 1 */}
            <div className="p-4 rounded-lg border border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-gray-200 transition">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-gray-900">Sabbir Hossain</h4>
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-800 rounded-full">
                    Pending
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  Requested: <strong className="text-gray-800">Green Valley Luxury Apartment</strong>
                </p>
                <p className="text-xs text-gray-400">Move-in Date: Nov 1, 2026</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition shadow-sm">
                  <CheckCircle className="w-3.5 h-3.5" /> Accept
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition">
                  <XCircle className="w-3.5 h-3.5" /> Reject
                </button>
              </div>
            </div>

            {/* Request Card 2 */}
            <div className="p-4 rounded-lg border border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-gray-200 transition">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-gray-900">Arifur Rahman</h4>
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-800 rounded-full">
                    Pending
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  Requested: <strong className="text-gray-800">Sunset Heights Studio Flat</strong>
                </p>
                <p className="text-xs text-gray-400">Move-in Date: Nov 10, 2026</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition shadow-sm">
                  <CheckCircle className="w-3.5 h-3.5" /> Accept
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition">
                  <XCircle className="w-3.5 h-3.5" /> Reject
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Property Overview (Right 1 col) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Top Listed</h2>
              <span className="text-xs text-gray-400">Khulna Region</span>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-3">
                <div className="w-12 h-12 rounded bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Building className="w-6 h-6" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-sm font-semibold text-gray-800 truncate">Green Valley Flat</h4>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-blue-500" /> Alir Club Mor
                  </p>
                  <p className="text-xs font-bold text-gray-900 mt-0.5">৳18,000 / mo</p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-3">
                <div className="w-12 h-12 rounded bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <Building className="w-6 h-6" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-sm font-semibold text-gray-800 truncate">KDA Avenue Residency</h4>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-blue-500" /> KDA Avenue
                  </p>
                  <p className="text-xs font-bold text-gray-900 mt-0.5">৳25,000 / mo</p>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/dashboard/my-properties"
            className="mt-6 text-center text-xs font-semibold text-green-600 hover:underline block"
          >
            Manage all 8 properties →
          </Link>
        </div>

      </div>
    </div>
  );
};

export default LandlordDashboardPage;