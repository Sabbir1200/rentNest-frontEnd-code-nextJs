import React from "react";
import { Users, Home, DollarSign, ArrowUpRight, TrendingUp, ShieldAlert } from "lucide-react";

const AdminDashboardPage = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back! Here is a quick overview of the platform statistics.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition">
            Download Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <div className="overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">2,450</h3>
            </div>
            <div className="rounded-full bg-blue-50 p-3 text-blue-600">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="font-semibold">+12%</span>
            <span className="text-gray-400 ml-2">from last month</span>
          </div>
        </div>

        {/* Total Properties */}
        <div className="overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Properties Listed</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">1,180</h3>
            </div>
            <div className="rounded-full bg-indigo-50 p-3 text-indigo-600">
              <Home className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="font-semibold">+8.4%</span>
            <span className="text-gray-400 ml-2">from last month</span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">$48,250</h3>
            </div>
            <div className="rounded-full bg-emerald-50 p-3 text-emerald-600">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="font-semibold">+24%</span>
            <span className="text-gray-400 ml-2">from last month</span>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">15</h3>
            </div>
            <div className="rounded-full bg-amber-50 p-3 text-amber-600">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-amber-600">
            <span>Requires attention</span>
          </div>
        </div>
      </div>

      {/* Recent Activity Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent System Users</h2>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
            View All <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">Role</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-600">
              <tr className="hover:bg-gray-50 transition">
                <td className="py-4 px-6 font-medium text-gray-900">John Doe</td>
                <td className="py-4 px-6"><span className="px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-700 rounded-full">LANDLORD</span></td>
                <td className="py-4 px-6"><span className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 rounded-full">Active</span></td>
                <td className="py-4 px-6">Oct 20, 2026</td>
              </tr>
              <tr className="hover:bg-gray-50 transition">
                <td className="py-4 px-6 font-medium text-gray-900">Sarah Smith</td>
                <td className="py-4 px-6"><span className="px-2.5 py-1 text-xs font-semibold bg-purple-50 text-purple-700 rounded-full">TENANT</span></td>
                <td className="py-4 px-6"><span className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 rounded-full">Active</span></td>
                <td className="py-4 px-6">Oct 21, 2026</td>
              </tr>
              <tr className="hover:bg-gray-50 transition">
                <td className="py-4 px-6 font-medium text-gray-900">Michael Lee</td>
                <td className="py-4 px-6"><span className="px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-700 rounded-full">LANDLORD</span></td>
                <td className="py-4 px-6"><span className="px-2.5 py-1 text-xs font-semibold bg-amber-50 text-amber-700 rounded-full">Pending</span></td>
                <td className="py-4 px-6">Oct 22, 2026</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;