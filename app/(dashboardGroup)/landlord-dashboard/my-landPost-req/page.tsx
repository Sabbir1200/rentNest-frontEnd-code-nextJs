"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createProperty,
  updateProperty,
  deleteProperty,
  getCategories,
} from "../../_actions/landlord.action";
import {
  
  Plus,
  Trash2,
  Edit,
  Loader2,
  FileText,
  MapPin,
  
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";


interface ICategory {
  id: string;
  name: string;
}

interface IProperty {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  address: string;
  city: string;
  rentAmount: number;
  category?: {
    name: string;
  };
}

export default function LandlordPropertiesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  // Modal States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<IProperty | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    address: "",
    city: "",
    rentAmount: "",
  });

  // Fetch Landlord Properties & Categories
  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Properties
      const propRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/landlord/properties`, {
        cache: "no-store",
        credentials: "include",
      });
      const propResult = await propRes.json();
      if (propRes.ok) {
        setProperties(propResult.data || []);
      }

      // 2. Fetch Categories
      setLoadingCategories(true);
      const catRes = await getCategories();
      if (catRes.success) {
        setCategories(catRes.data || []);
      }
    } catch (error) {
      console.error("Failed to load initial data:", error);
    } finally {
      setLoading(false);
      setLoadingCategories(false);
    }
  };

  // ✅ সঠিক নিয়ম: useEffect-এর ভেতরে async ফাংশন লিখে কল করা
  useEffect(() => {
    let isMounted = true;

    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const propRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/landlord/properties`, {
          cache: "no-store",
          credentials: "include",
        });
        const propResult = await propRes.json();
        
        if (isMounted && propRes.ok) {
          setProperties(propResult.data || []);
        }

        setLoadingCategories(true);
        const catRes = await getCategories();
        if (isMounted && catRes.success) {
          setCategories(catRes.data || []);
        }
      } catch (error) {
        console.error("Failed to load initial data:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
          setLoadingCategories(false);
        }
      }
    };

    fetchInitialData();

    return () => {
      isMounted = false; 
    };
  }, []);

  // 1️⃣ Handle Create Property (POST)
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
      alert("Please select a category!");
      return;
    }

    startTransition(async () => {
      const res = await createProperty({
        ...formData,
        rentAmount: Number(formData.rentAmount),
      });

      if (res.success) {
        alert("Property created successfully!");
        setIsAddOpen(false);
        setFormData({ title: "", description: "", categoryId: "", address: "", city: "", rentAmount: "" });
        router.refresh();
        fetchInitialData();
      } else {
        alert(res.message || "Failed to create property");
      }
    });
  };

  // 2️⃣ Handle Update Property (PUT)
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProperty) return;

    startTransition(async () => {
      const res = await updateProperty(selectedProperty.id, {
        ...formData,
        rentAmount: Number(formData.rentAmount),
      });

      if (res.success) {
        alert("Property updated successfully!");
        setIsEditOpen(false);
        setSelectedProperty(null);
        router.refresh();
        fetchInitialData();
      } else {
        alert(res.message || "Failed to update property");
      }
    });
  };

  // 3️⃣ Handle Delete Property (DELETE)
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    startTransition(async () => {
      const res = await deleteProperty(id);
      if (res.success) {
        alert("Property deleted successfully!");
        setProperties((prev) => prev.filter((p) => p.id !== id));
        router.refresh();
      } else {
        alert(res.message || "Failed to delete property");
      }
    });
  };

  // Open Edit Modal with Data
  const openEditModal = (property: IProperty) => {
    setSelectedProperty(property);
    setFormData({
      title: property.title,
      description: property.description,
      categoryId: property.categoryId,
      address: property.address,
      city: property.city,
      rentAmount: property.rentAmount.toString(),
    });
    setIsEditOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 bg-gray-50/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Manage Properties
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Create, update, or remove your rental properties easily.
          </p>
        </div>

        <Button
          onClick={() => {
            setFormData({ title: "", description: "", categoryId: "", address: "", city: "", rentAmount: "" });
            setIsAddOpen(true);
          }}
          className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          <Plus className="w-4 h-4" /> Add New Property
        </Button>
      </div>

      {/* Property Cards Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-500 font-medium text-sm">Loading properties...</p>
        </div>
      ) : properties.length === 0 ? (
        <div className="p-12 bg-white border border-gray-200/80 rounded-2xl text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <p className="text-gray-600 font-medium">No properties found. Add your first property!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((item) => (
            <div key={item.id} className="bg-white p-6 border border-gray-200/80 rounded-2xl shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{item.title}</h3>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                    {item.category?.name || "Property"}
                  </span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                <div className="flex items-center gap-1.5 text-xs text-gray-400 pt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{item.address}, {item.city}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 block">Rent Amount</span>
                  <span className="font-bold text-gray-900 text-base">৳{Number(item.rentAmount).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditModal(item)}
                    className="h-8 px-3 text-xs"
                  >
                    <Edit className="w-3.5 h-3.5 mr-1" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(item.id)}
                    disabled={isPending}
                    className="h-8 px-3 text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ➕ ADD PROPERTY MODAL */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md p-6 bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-950">Add New Property</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Title</label>
              <input
                type="text"
                required
                className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                placeholder="e.g. Modern Apartment"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Category</label>
              <select
                required
                className="w-full p-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              >
                <option value="">
                  {loadingCategories ? "Loading categories..." : "Select Category"}
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Description</label>
              <textarea
                required
                className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                placeholder="Property details..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Address</label>
                <input
                  type="text"
                  required
                  className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  placeholder="Street / Area"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">City</label>
                <input
                  type="text"
                  required
                  className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Rent Amount (৳)</label>
              <input
                type="number"
                required
                className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                placeholder="25000"
                value={formData.rentAmount}
                onChange={(e) => setFormData({ ...formData, rentAmount: e.target.value })}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Create Property
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ✏️ EDIT PROPERTY MODAL */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md p-6 bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-950">Update Property</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleUpdate} className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Title</label>
              <input
                type="text"
                required
                className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Category</label>
              <select
                required
                className="w-full p-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Description</label>
              <textarea
                required
                className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Address</label>
                <input
                  type="text"
                  required
                  className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">City</label>
                <input
                  type="text"
                  required
                  className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Rent Amount (৳)</label>
              <input
                type="number"
                required
                className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                value={formData.rentAmount}
                onChange={(e) => setFormData({ ...formData, rentAmount: e.target.value })}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Update Property
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}